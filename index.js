// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/UserRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the User routes
app.use('/api/users', userRoutes);

// app.use("/",(req,res)=>{
//   res.json({message:"connected express app"})
// })
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
    console.log('MongoDB Connection Error:', err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
