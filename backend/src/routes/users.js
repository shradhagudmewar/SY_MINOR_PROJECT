const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /api/users
// Supports filters:
// - role (e.g. ?role=alumni)
// - department (string)
// - batch (maps to graduationYear or year)
// - company (matches currentCompany, case-insensitive)
router.get('/', async (req, res) => {
  try {
    const { role, department, batch, company } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (department) {
      filter.department = department;
    }

    if (batch) {
      // Try to match either graduationYear or student year
      filter.$or = [
        { graduationYear: batch },
        { year: batch },
      ];
    }

    if (company) {
      filter.currentCompany = {
        $regex: new RegExp(company, 'i'),
      };
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
});

module.exports = router;

