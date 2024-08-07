// backend/routes/solutionRoutes.js
const express = require('express');
const {
  createSolution,
  getSolutionsForProblem,
  voteSolution,
} = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:problemId').get(getSolutionsForProblem).post(protect, createSolution);
router.put('/:id/vote', protect, voteSolution);

module.exports = router;
