const Todo = require("../Models/Todo");

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please add a title" });
    }

    const newTodo = new Todo({
      userId: req.user.id,
      title,
      description,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Make sure the logged in user matches the todo user
    if (todo.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this todo" });
    }

    todo.title = title || todo.title;
    todo.description =
      description !== undefined ? description : todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Make sure the logged in user matches the todo user
    if (todo.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this todo" });
    }

    await todo.deleteOne();
    res.status(200).json({ message: "Todo removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
