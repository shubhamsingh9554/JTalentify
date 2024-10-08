const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Add this line
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
