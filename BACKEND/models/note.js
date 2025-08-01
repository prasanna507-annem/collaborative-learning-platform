const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'] 
    },
    subject: { 
        type: String, 
        required: [true, 'Subject is required'] 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    filePath: { 
        type: String, 
        required: [true, 'File path is required'] 
    },
    originalFileName: { 
        type: String, 
        required: [true, 'Original filename is required'] 
    }
}, { 
    timestamps: true,
    collection: 'notes' // Explicit collection name
});

module.exports = mongoose.model('Note', noteSchema);