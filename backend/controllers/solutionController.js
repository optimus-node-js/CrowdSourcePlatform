// backend/controllers/solutionController.js
const asyncHandler = require('express-async-handler');
const Solution = require('../models/solutionModel'); // Assuming a separate Solution model
const Problem = require('../models/problemModel'); // Assuming solutions are part of Problem model

// @desc    List solutions for a problem
// @route   GET /api/solutions/:problemId
// @access  Public
const listSolutions = asyncHandler(async (req, res) => {
  const solutions = await Solution.find({ problem: req.params.problemId });
  res.json(solutions);
});

// @desc    Create a solution for a problem
// @route   POST /api/solutions/:problemId
// @access  Private
const createSolution = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const problem = await Problem.findById(req.params.problemId);

  if (problem) {
    const solution = new Solution({
      text,
      user: req.user._id,
      problem: req.params.problemId,
    });

    const createdSolution = await solution.save();
    res.status(201).json(createdSolution);
  } else {
    res.status(404);
    throw new Error('Problem not found');
  }
});

// @desc    Vote on a solution
// @route   PUT /api/solutions/:id/vote
// @access  Private
const voteSolution = asyncHandler(async (req, res) => {
  const { vote } = req.body;
  const solution = await Solution.findById(req.params.id);

  if (solution) {
    solution.votes += vote;
    const updatedSolution = await solution.save();
    res.json(updatedSolution);
  } else {
    res.status(404);
    throw new Error('Solution not found');
  }
});

module.exports = {
  listSolutions,
  createSolution,
  voteSolution,
};
