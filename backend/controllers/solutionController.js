const asyncHandler = require('express-async-handler');
const Solution = require('../models/solutionModel');
const Problem = require('../models/problemModel');

const getSolutions = asyncHandler(async (req, res) => {
    const solutions = await Solution.find({ problem: req.params.problemId }).populate('user', 'firstName lastName');
    res.json(solutions);
});

const createSolution = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const problemId = req.params.problemId;

    const solution = await Solution.create({
        text,
        user: req.user._id,
        problem: problemId
    });

    res.status(201).json(solution);
});

// Update voteSolution function
const voteSolution = async (req, res) => {
    const solutionId = req.params.solutionId;
    const userId = req.user._id;
    const { vote } = req.body;

    try {
        const solution = await Solution.findById(solutionId);

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        const existingVote = solution.voters.find(voter => voter.userId.toString() === userId.toString());

        if (existingVote) {
            if (existingVote.vote === vote) {
                // Remove vote if the user is toggling the same vote
                solution.voters = solution.voters.filter(voter => voter.userId.toString() !== userId.toString());
            } else {
                // Update the vote
                existingVote.vote = vote;
            }
        } else {
            // Add new vote
            solution.voters.push({ userId, vote });
        }

        // Calculate the total votes
        solution.votes = solution.voters.reduce((acc, voter) => acc + voter.vote, 0);

        await solution.save();
        res.status(200).json(solution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getSolutions, createSolution, voteSolution };
