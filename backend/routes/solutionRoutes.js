const express = require('express');
const router = express.Router();
const { getSolutions, createSolution, voteSolution } = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

// Update the route to use problemId for creating a solution
router.route('/:problemId/solutions').get(getSolutions).post(protect, createSolution);
router.route('/:solutionId/vote').put(protect, voteSolution);

module.exports = router;
