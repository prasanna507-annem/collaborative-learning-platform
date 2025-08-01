const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    replyUserName: { type: String, required: true },
    replyText: { type: String, required: true },
    date: { type: String, default: new Date().toLocaleDateString() },
});

const questionSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    topic: { type: String, required: true },
    questionText: { type: String, required: true },
    date: { type: String, default: new Date().toLocaleDateString() },
    replies: [replySchema],
});

module.exports = mongoose.model("Question", questionSchema);