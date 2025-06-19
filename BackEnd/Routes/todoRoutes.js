const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../Controllers/todoController");
const { protect } = require("../Middlewares/AuthMiddleware");

// Apply the protect middleware to all routes
router.use(protect);

// Define routes
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
