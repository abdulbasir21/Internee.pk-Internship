const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const User = require('../models/User');
const { isNonEmptyString, isPositiveNumber } = require('../utils/validators');

// GET /api/courses — public. Never sends content, so premium lesson text
// can't leak through the catalog listing.
async function listCourses(req, res) {
  try {
    const courses = await Course.find().select('title category price isFree previewImage createdAt');
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load courses' });
  }
}

// GET /api/courses/:id — public route, but the full lesson content is only
// attached when the course is free or the (optional) logged-in student owns it.
// We do the ownership check manually here instead of forcing login, so
// anonymous visitors can still see course details minus the content link.
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const base = {
      _id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      isFree: course.isFree,
      previewImage: course.previewImage,
    };

    // Free courses: always include content.
    if (course.isFree) {
      return res.status(200).json({ success: true, course: { ...base, content: course.content } });
    }

    // Premium course: only include content if a valid logged-in student purchased it.
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        const owns =
          user &&
          (user.role === 'admin' ||
            user.purchasedCourses.some((id) => id.toString() === course._id.toString()));
        if (owns) {
          return res.status(200).json({ success: true, course: { ...base, content: course.content } });
        }
      } catch (_) {
        // invalid/expired token — fall through and return course without content
      }
    }

    res.status(200).json({ success: true, course: base });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load course' });
  }
}

// POST /api/courses — admin only
async function createCourse(req, res) {
  try {
    const { title, description, category, price, isFree, content, previewImage } = req.body;

    const hasContent = Array.isArray(content) && content.length > 0 && content.every(isNonEmptyString);

    if (!isNonEmptyString(title) || !isNonEmptyString(description) || !isNonEmptyString(category) || !hasContent) {
      return res.status(400).json({ success: false, message: 'title, description, category, and content (array of paragraphs) are required' });
    }
    if (!isPositiveNumber(price)) {
      return res.status(400).json({ success: false, message: 'price must be a non-negative number' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price,
      isFree: Boolean(isFree),
      content,
      previewImage,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
}

// PATCH /api/courses/:id — admin only
async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const allowedFields = ['title', 'description', 'category', 'price', 'isFree', 'content', 'previewImage'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    await course.save();
    res.status(200).json({ success: true, message: 'Course updated', course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
}

// DELETE /api/courses/:id — admin only
async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
}

module.exports = { listCourses, getCourseById, createCourse, updateCourse, deleteCourse };
