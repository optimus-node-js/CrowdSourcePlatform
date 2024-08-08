const express = require('express');
const router = express.Router();
const { getSolutions, createSolution, voteSolution } = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:problemId').get(getSolutions);
router.route('/').post(protect, createSolution);
router.route('/:solutionId/vote').put(protect, voteSolution);

module.exports = router;
