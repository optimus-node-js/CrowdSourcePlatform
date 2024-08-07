// backend/models/solutionModel.js
const mongoose = require('mongoose');

const solutionSchema = mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Problem',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
