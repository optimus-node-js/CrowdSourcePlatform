const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Write your proposed fix'], trim: true, minlength: [10, 'Please write at least 10 characters'], maxlength: [3000, 'That is too long'] },
    kind: { type: String, enum: ['fix', 'update', 'resource'], default: 'fix' },
    votes: { type: Number, default: 0 },
    voters: [
      {
        _id: false,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vote: { type: Number, enum: [-1, 1] },
      },
    ],
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Solution', solutionSchema);
