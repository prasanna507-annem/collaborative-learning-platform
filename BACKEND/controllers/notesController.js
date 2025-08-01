const fs = require('fs');
const path = require('path');
const Note = require('../models/note');

// Helper function to clean up files
const cleanupFile = (filePath) => {
  if (filePath) {
    const absolutePath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    // Validate required fields
    if (!title || !subject || !description) {
      cleanupFile(req.file?.path);
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and description are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    const newNote = new Note({
      title,
      subject,
      description,
      filePath: `/uploads/${req.file.filename}`,
      originalFileName: req.file.originalname
    });

    const savedNote = await newNote.save();
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: savedNote
    });

  } catch (error) {
    cleanupFile(req.file?.path);
    console.error('Error creating note:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
};

// Get all notes with pagination
exports.getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search 
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title subject description filePath originalFileName createdAt');

    const count = await Note.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        itemsPerPage: Number(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    cleanupFile(note.filePath);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
};

// Get note count
