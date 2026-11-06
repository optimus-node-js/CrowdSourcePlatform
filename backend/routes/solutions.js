const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Solution = require('../models/Solution');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const realtime = require('../realtime');

const POINTS = { accepted: 15 };

// POST /api/solutions/:id/vote  { value: 1 | -1 | 0 }
router.post(
  '/:id/vote',
  protect,
  asyncHandler(async (req, res) => {
    const value = Number(req.body.value);
    if (![1, -1, 0].includes(value)) {
      res.status(400);
      throw new Error('Vote must be 1, -1 or 0');
    }
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      res.status(404);
      throw new Error('Solution not found');
    }
    if (String(solution.user) === String(req.user._id)) {
      res.status(400);
      throw new Error('You cannot vote on your own proposal');
    }
    const uid = String(req.user._id);
    const previous = solution.voters.find((v) => String(v.userId) === uid);
    const before = previous ? previous.vote : 0;
    solution.voters = solution.voters.filter((v) => String(v.userId) !== uid);
    if (value !== 0) solution.voters.push({ userId: req.user._id, vote: value });
    solution.votes = solution.voters.reduce((sum, v) => sum + v.vote, 0);
    await solution.save({ validateModifiedOnly: true });
    if (value - before !== 0) await User.award(solution.user, value - before);
    realtime.emit('solution:voted', { id: String(solution._id), votes: solution.votes }, `issue:${solution.problem}`);
    res.json({ id: solution._id, votes: solution.votes, myVote: value });
  })
);

// POST /api/solutions/:id/accept  (reporter or moderator)
router.post(
  '/:id/accept',
  protect,
  asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      res.status(404);
      throw new Error('Solution not found');
    }
    const issue = await Issue.findById(solution.problem);
    const allowed = issue && (String(issue.user) === String(req.user._id) || req.user.role === 'moderator');
    if (!allowed) {
      res.status(403);
      throw new Error('Only the reporter or a moderator can accept a fix');
    }
    if (issue.acceptedSolution && String(issue.acceptedSolution) !== String(solution._id)) {
      await Solution.updateOne({ _id: issue.acceptedSolution }, { accepted: false });
    }
    const firstTime = !solution.accepted;
    solution.accepted = true;
    await solution.save({ validateModifiedOnly: true });
    issue.acceptedSolution = solution._id;
    await issue.save({ validateModifiedOnly: true });
    if (firstTime) await User.award(solution.user, POINTS.accepted);
    realtime.emit('solution:accepted', { id: String(solution._id) }, `issue:${issue._id}`);
    res.json({ id: solution._id, accepted: true });
  })
);

module.exports = router;
