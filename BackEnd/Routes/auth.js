const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const { protect } = require("../Middlewares/AuthMiddleware");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("Signup attempt:", { email, name });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    console.log("User created successfully:", email);

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res
      .status(201)
      .json({ user: { email: user.email, name: user.name }, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log("Login successful:", email);

    res.json({ user: { email: user.email, name: user.name }, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get current user route (protected)
router.get("/me", protect, async (req, res) => {
  res.json({ user: { email: req.user.email, name: req.user.name } });
});

module.exports = router;
