const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');
const Solution = require('../models/Solution');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');
const realtime = require('../realtime');

const { CATEGORIES, SEVERITIES, STATUSES } = Issue;
const POINTS = { report: 2, solution: 5, resolvedReporter: 3 };
const AUTHOR_FIELDS = 'firstName lastName city reputation';

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function canManage(user, issue) {
  if (!user) return false;
  const owner = issue.user && (issue.user._id || issue.user);
  return String(owner) === String(user._id) || user.role === 'moderator';
}

function serialize(issue, user) {
  const o = issue.toObject ? issue.toObject({ virtuals: true }) : issue;
  const upvotes = o.upvotes || [];
  return {
    ...o,
    upvotes: undefined,
    upvoteCount: o.upvoteCount ?? upvotes.length,
    hasUpvoted: user ? upvotes.some((id) => String(id) === String(user._id)) : false,
    canManage: canManage(user, o),
  };
}

// GET /api/issues  ?q&category&status&city&severity&sort=top|newest|unresolved&page&limit&mine
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { q, category, status, city, severity, sort = 'top', mine } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

    const filter = {};
    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (status && STATUSES.includes(status)) filter.status = status;
    if (severity && SEVERITIES.includes(severity)) filter.severity = severity;
    if (city) filter.city = new RegExp(`^${escapeRegex(String(city).trim())}$`, 'i');
    if (mine === 'true' && req.user) filter.user = req.user._id;
    if (q) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { area: rx }, { tags: rx }];
    }

    const sorts = {
      top: { upvoteCount: -1, createdAt: -1 },
      newest: { createdAt: -1 },
      unresolved: { status: 1, upvoteCount: -1, createdAt: -1 },
    };
    if (sort === 'unresolved' && !filter.status) filter.status = { $ne: 'resolved' };

    const [items, total] = await Promise.all([
      Issue.find(filter)
        .sort(sorts[sort] || sorts.top)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-statusHistory')
        .populate('user', AUTHOR_FIELDS),
      Issue.countDocuments(filter),
    ]);

    res.json({ items: items.map((i) => serialize(i, req.user)), total, page, pages: Math.ceil(total / limit) || 1 });
  })
);

router.get('/meta', (req, res) => res.json({ categories: CATEGORIES, severities: SEVERITIES, statuses: STATUSES }));

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { title, description, category, severity, city, area, imageUrl, tags } = req.body;
    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      city: city || req.user.city,
      area,
      imageUrl,
      tags: Array.isArray(tags) ? tags.slice(0, 8) : String(tags || '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8),
      user: req.user._id,
      upvotes: [req.user._id],
      upvoteCount: 1,
      statusHistory: [{ status: 'reported', by: req.user._id, note: 'Issue reported' }],
    });
    await User.award(req.user._id, POINTS.report);
    await issue.populate('user', AUTHOR_FIELDS);
    const payload = serialize(issue, req.user);
    realtime.emit('issue:created', payload);
    res.status(201).json(payload);
  })
);

router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
      .populate('user', AUTHOR_FIELDS)
      .populate('statusHistory.by', 'firstName lastName');
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }
    const solutions = await Solution.find({ problem: issue._id })
      .sort({ accepted: -1, votes: -1, createdAt: 1 })
      .populate('user', AUTHOR_FIELDS)
      .lean();
    const uid = req.user && String(req.user._id);
    res.json({
      ...serialize(issue, req.user),
      solutions: solutions.map((s) => ({
        ...s,
        myVote: uid ? (s.voters || []).find((v) => String(v.userId) === uid)?.vote || 0 : 0,
        voters: undefined,
      })),
    });
  })
);

router.post(
  '/:id/upvote',
  protect,
  asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id).select('upvotes upvoteCount');
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }
    const already = issue.upvotes.some((id) => String(id) === String(req.user._id));
    const update = already
      ? { $pull: { upvotes: req.user._id }, $inc: { upvoteCount: -1 } }
      : { $addToSet: { upvotes: req.user._id }, $inc: { upvoteCount: 1 } };
    const updated = await Issue.findByIdAndUpdate(issue._id, update, { new: true }).select('upvoteCount');
    const payload = { id: String(issue._id), upvoteCount: updated.upvoteCount, hasUpvoted: !already };
    realtime.emit('issue:upvoted', { id: payload.id, upvoteCount: payload.upvoteCount });
    res.json(payload);
  })
);

router.patch(
  '/:id/status',
  protect,
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    if (!STATUSES.includes(status)) {
      res.status(400);
      throw new Error('Unknown status');
    }
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }
    if (!canManage(req.user, issue)) {
      res.status(403);
      throw new Error('Only the reporter or a moderator can change the status');
    }
    const wasResolved = issue.status === 'resolved';
    issue.status = status;
    issue.statusHistory.push({ status, note: note || '', by: req.user._id });
    issue.resolvedAt = status === 'resolved' ? new Date() : undefined;
    await issue.save({ validateModifiedOnly: true });
    if (status === 'resolved' && !wasResolved) await User.award(issue.user, POINTS.resolvedReporter);
    realtime.emit('issue:status', { id: String(issue._id), status }, `issue:${issue._id}`);
    realtime.emit('issue:status', { id: String(issue._id), status });
    res.json({ id: issue._id, status: issue.status });
  })
);

router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }
    if (!canManage(req.user, issue)) {
      res.status(403);
      throw new Error('Only the reporter or a moderator can delete this issue');
    }
    await Solution.deleteMany({ problem: issue._id });
    await issue.deleteOne();
    realtime.emit('issue:deleted', { id: String(issue._id) });
    res.json({ message: 'Issue deleted' });
  })
);

router.post(
  '/:id/solutions',
  protect,
  asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id).select('_id');
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }
    const solution = await Solution.create({
      problem: issue._id,
      user: req.user._id,
      text: req.body.text,
      kind: req.body.kind,
    });
    await Issue.updateOne({ _id: issue._id }, { $inc: { solutionCount: 1 } });
    await User.award(req.user._id, POINTS.solution);
    await solution.populate('user', AUTHOR_FIELDS);
    const payload = { ...solution.toObject(), voters: undefined, myVote: 0 };
    realtime.emit('solution:created', payload, `issue:${issue._id}`);
    res.status(201).json(payload);
  })
);

module.exports = router;
