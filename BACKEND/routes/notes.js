const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/note'); // Import the Note model directly
const {
  createNote,
  getNotes,
  deleteNote
} = require('../controllers/notesController');

const router = express.Router();

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .replace(/\.\./g, '');
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, JPG, and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
router.post('/', upload.single('file'), createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

// Count route - implemented directly in the route file
router.get('/count', async (req, res) => {
  try {
    const count = await Note.countDocuments({});
    
    res.status(200).json({
      success: true,
      totalNotes: count,
      message: `Found ${count} notes in the database`
    });
  } catch (error) {
    console.error('Error counting notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get note count',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;