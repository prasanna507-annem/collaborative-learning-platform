const Question = require("../models/Question");

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new question
const addQuestion = async (req, res) => {
    const { userName, topic, questionText } = req.body;
    try {
        const newQuestion = new Question({ userName, topic, questionText });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a reply to a question
const addReply = async (req, res) => {
    const { id } = req.params; // Question ID
    const { replyUserName, replyText } = req.body;
    try {
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        question.replies.push({ replyUserName, replyText }); // Add reply to the array
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllQuestions, addQuestion, addReply };