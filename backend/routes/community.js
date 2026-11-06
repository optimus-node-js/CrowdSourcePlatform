const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');
const Solution = require('../models/Solution');
const User = require('../models/User');

// GET /api/stats  ?city=
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const city = String(req.query.city || '').trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = city ? { city: new RegExp(`^${city}$`, 'i') } : {};
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [byStatus, byCategory, topCities, recentCount, solutions, members, resolution] = await Promise.all([
      Issue.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Issue.aggregate([
        { $match: match },
        { $group: { _id: '$category', count: { $sum: 1 }, open: { $sum: { $cond: [{ $ne: ['$status', 'resolved'] }, 1, 0] } } } },
        { $sort: { count: -1 } },
      ]),
      Issue.aggregate([
        { $match: { city: { $nin: ['', null] } } },
        { $group: { _id: { $toLower: '$city' }, label: { $first: '$city' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Issue.countDocuments({ ...match, createdAt: { $gte: weekAgo } }),
      Solution.countDocuments(),
      User.countDocuments(),
      Issue.aggregate([
        { $match: { ...match, status: 'resolved', resolvedAt: { $ne: null } } },
        { $group: { _id: null, avgMs: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } } } },
      ]),
    ]);

    const statusCounts = Object.fromEntries(Issue.STATUSES.map((s) => [s, 0]));
    byStatus.forEach((s) => {
      statusCounts[s._id || 'reported'] = (statusCounts[s._id || 'reported'] || 0) + s.count;
    });
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    res.json({
      total,
      statusCounts,
      resolutionRate: total ? Math.round((statusCounts.resolved / total) * 100) : 0,
      avgResolutionDays: resolution[0] ? +(resolution[0].avgMs / 86400000).toFixed(1) : null,
      reportedThisWeek: recentCount,
      solutions,
      members,
      byCategory: byCategory.map((c) => ({ category: c._id || 'other', count: c.count, open: c.open })),
      topCities: topCities.map((c) => ({ city: c.label, count: c.count })),
    });
  })
);

// GET /api/leaderboard
router.get(
  '/leaderboard',
  asyncHandler(async (req, res) => {
    const users = await User.find({ reputation: { $gt: 0 } })
      .sort({ reputation: -1, createdAt: 1 })
      .limit(20)
      .select('firstName lastName city reputation createdAt');
    const ids = users.map((u) => u._id);
    const [reports, fixes] = await Promise.all([
      Issue.aggregate([{ $match: { user: { $in: ids } } }, { $group: { _id: '$user', n: { $sum: 1 } } }]),
      Solution.aggregate([
        { $match: { user: { $in: ids } } },
        { $group: { _id: '$user', n: { $sum: 1 }, accepted: { $sum: { $cond: ['$accepted', 1, 0] } } } },
      ]),
    ]);
    const r = Object.fromEntries(reports.map((x) => [String(x._id), x.n]));
    const f = Object.fromEntries(fixes.map((x) => [String(x._id), x]));
    res.json(
      users.map((u) => ({
        _id: u._id,
        name: u.name,
        city: u.city,
        reputation: u.reputation,
        reports: r[String(u._id)] || 0,
        fixes: f[String(u._id)]?.n || 0,
        acceptedFixes: f[String(u._id)]?.accepted || 0,
      }))
    );
  })
);

module.exports = router;
