const mongoose = require('mongoose');

const CATEGORIES = ['roads', 'water', 'electricity', 'sanitation', 'safety', 'transport', 'environment', 'public-spaces', 'other'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['reported', 'acknowledged', 'in_progress', 'resolved'];

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUSES, required: true },
    note: { type: String, trim: true, maxlength: 500, default: '' },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: [6, 'Title should be at least 6 characters'], maxlength: [120, 'Title can be at most 120 characters'] },
    description: { type: String, required: [true, 'Description is required'], trim: true, minlength: [20, 'Add a few more details (at least 20 characters)'], maxlength: [4000, 'Description is too long'] },
    category: { type: String, enum: CATEGORIES, default: 'other', index: true },
    severity: { type: String, enum: SEVERITIES, default: 'medium' },
    city: { type: String, trim: true, maxlength: 60, default: '', index: true },
    area: { type: String, trim: true, maxlength: 120, default: '' },
    imageUrl: { type: String, trim: true, maxlength: 500, default: '' },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    status: { type: String, enum: STATUSES, default: 'reported', index: true },
    statusHistory: [statusEventSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0, index: true },
    solutionCount: { type: Number, default: 0 },
    acceptedSolution: { type: mongoose.Schema.Types.ObjectId, ref: 'Solution', default: null },
    resolvedAt: Date,
  },
  { timestamps: true }
);

issueSchema.index({ title: 'text', description: 'text', area: 'text', tags: 'text' });

// "Problem" keeps the v1 collection, so existing data is carried over.
const Issue = mongoose.model('Problem', issueSchema);

module.exports = Issue;
module.exports.CATEGORIES = CATEGORIES;
module.exports.SEVERITIES = SEVERITIES;
module.exports.STATUSES = STATUSES;
