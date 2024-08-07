// backend/routes/problemRoutes.js
const express = require('express');
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getProblems).post(protect, createProblem);
router
  .route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

module.exports = router;
