const express = require('express');
const {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', listCourses);
router.get('/:id', getCourseById);

// Admin only
router.post('/', protect, isAdmin, createCourse);
router.patch('/:id', protect, isAdmin, updateCourse);
router.delete('/:id', protect, isAdmin, deleteCourse);

module.exports = router;
