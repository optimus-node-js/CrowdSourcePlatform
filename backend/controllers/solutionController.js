// backend/controllers/solutionController.js
const Solution = require('../models/Solution');
const Problem = require('../models/Problem');

const createSolution = async (req, res) => {
  const { content } = req.body;
  const { problemId } = req.params;

  const problem = await Problem.findById(problemId);

  if (!problem) {
    return res.status(404).json({ message: 'Problem not found' });
  }

  const solution = await Solution.create({
    content,
    problem: problemId,
    user: req.user._id,
  });

  problem.solutions.push(solution._id);
  await problem.save();

  res.status(201).json(solution);
};

const getSolutionsForProblem = async (req, res) => {
  const solutions = await Solution.find({ problem: req.params.problemId }).populate(
    'user',
    'name'
  );

  res.json(solutions);
};

const voteSolution = async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // vote can be +1 or -1

  const solution = await Solution.findById(id);

  if (solution) {
    solution.votes += vote;
    await solution.save();
    res.json(solution);
  } else {
    res.status(404).json({ message: 'Solution not found' });
  }
};

module.exports = {
  createSolution,
  getSolutionsForProblem,
  voteSolution,
};
