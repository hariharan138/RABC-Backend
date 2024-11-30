// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.log('MongoDB Connection Error:', err.message);
  });

// User model
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  mobile: String,
  password: String,
  gender: String,
  role: String,
  status: String,
});

const User = mongoose.model('User', userSchema);

// API Endpoints

// Register a new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { firstname, lastname, email, mobile, password, gender, role, status } = req.body;

    if (!firstname || !lastname || !email || !mobile || !password || !gender || !role) {
      return res.status(400).json({ error: true, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: true, message: 'User already exists with the given email or mobile number' });
    }

    const user = await User.create({ firstname, lastname, email, mobile, password, gender, role, status });
    res.status(201).json({ error: false, message: 'User registered successfully', data: user });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Login a user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: true, message: 'Invalid email or password' });
    }

    res.status(200).json({
      error: false,
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { firstname, lastname, email, mobile, password, gender, role, status } = req.body;

    if (!firstname || !lastname || !email || !mobile || !password || !gender || !role) {
      return res.status(400).json({ error: true, message: 'All fields are required' });
    }

    const user = await User.create({ firstname, lastname, email, mobile, password, gender, role, status });
    res.status(201).json({
      error: false,
      message: 'User added successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      error: false,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get a single user
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    res.status(200).json({
      error: false,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Edit a user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, mobile, password, gender, role, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { firstname, lastname, email, mobile, password, gender, role, status } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    res.status(200).json({
      error: false,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    res.status(200).json({
      error: false,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
