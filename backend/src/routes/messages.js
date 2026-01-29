const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// POST /api/messages  - save contact form message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, department, status, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required',
      });
    }

    const saved = await Message.create({
      name,
      email,
      phone,
      department,
      status,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: saved,
    });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
    });
  }
});

// GET /api/messages - list all messages (for simple admin view)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
    });
  }
});

module.exports = router;

