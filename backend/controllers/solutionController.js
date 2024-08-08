const asyncHandler = require('express-async-handler');
const Solution = require('../models/solutionModel');

const getSolutions = asyncHandler(async (req, res) => {
    const solutions = await Solution.find({ problem: req.params.problemId }).populate('user', 'firstName lastName');
    res.json(solutions);
});

const createSolution = asyncHandler(async (req, res) => {
    const { text, problemId } = req.body;
    const solution = await Solution.create({
        text,
        user: req.user._id,
        problem: problemId
    });
    res.status(201).json(solution);
});

const voteSolution = asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.solutionId);
    const vote = req.body.vote;

    if (solution) {
        solution.votes += vote;
        await solution.save();
        res.json(solution);
    } else {
        res.status(404);
        throw new Error('Solution not found');
    }
});

module.exports = { getSolutions, createSolution, voteSolution };
