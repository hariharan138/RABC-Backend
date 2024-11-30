const mongoose = require('mongoose');

const User = require("../models/User.model");

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, mobile, password, gender, role ,status} = req.body;
        
        if (!firstname || !lastname || !email || !mobile || !password || !gender || !role ) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ error: true, message: "User already exists with the given email or mobile number" });
        }
        
        const user = await User.create({
            firstname,
            lastname,
            email,
            mobile,
            password,
            gender,
            role,status
        });
        
        res.status(201).json({ error: false, message: "User registered successfully", data: user });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
          return res.status(400).json({ error: true, message: "Email and password are required" });
      }

      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found
      if (!user) {
          return res.status(400).json({ error: true, message: "Invalid email or password" });
      }

      // Compare the provided password with the stored password
      if (user.password !== password) {
          return res.status(400).json({ error: true, message: "Invalid email or password" });
      }

      // Return a successful response without exposing sensitive data
      res.status(200).json({
          error: false,
          message: "Login successful",
          user: { id: user._id, email: user.email, role: user.role }
      });

  } catch (err) {
      // Handle unexpected errors
      res.status(500).json({ error: true, message: err.message });
  }
};


const addUser = async (req, res) => {
    try {
        const { firstname, lastname, email, mobile, password, gender, role,status } = req.body;

        if (!firstname || !lastname || !email || !mobile || !password || !gender || !role ) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const user = await User.create({ firstname, lastname, email, mobile, password, gender, role,status });
        res.status(201).json({
            error: false,
            message: "User added successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            error: false,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: true,
                message: "Invalid user ID format",
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }
        res.status(200).json({
            error: false,
            message: "User fetched successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

const editUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, mobile, password, gender, role,status } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: true,
                message: "Invalid user ID format",
            });
        }
        const user = await User.findByIdAndUpdate(
            id,
            { $set: { firstname, lastname, email, mobile, password, gender, role,status } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }
        res.status(200).json({
            error: false,
            message: "User updated successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: true,
                message: "Invalid user ID format",
            });
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }
        res.status(200).json({
            error: false,
            message: "User deleted successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

module.exports = {
    register,
    login,
    addUser,
    getAllUsers,
    getSingleUser,
    editUser,
    deleteUser
};

