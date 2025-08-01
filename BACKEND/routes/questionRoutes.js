const express = require("express");
const { getAllQuestions, addQuestion, addReply } = require("../controllers/questionController");

const router = express.Router();

// GET all questions
router.get("/", getAllQuestions);

// POST a new question
router.post("/", addQuestion);

// POST a reply to a question
router.post("/:id/replies", addReply);

module.exports = router;