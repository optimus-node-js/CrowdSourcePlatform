// backend/routes/solutionRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  listSolutions,
  createSolution,
  voteSolution,
} = require('../controllers/solutionController');

const router = express.Router();

router.route('/:problemId').get(listSolutions).post(protect, createSolution);
router.route('/:id/vote').put(protect, voteSolution);

module.exports = router;
