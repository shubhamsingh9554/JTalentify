const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    admin = new Admin({ name, email, passwordHash });
    await admin.save();

    const payload = { userId: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.registerEmployee = async (req, res) => {
  const { name, email, password, department, role } = req.body;

  try {
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ message: 'Employee already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    employee = new Employee({ name, email, passwordHash, department, role });
    await employee.save();

    const payload = { userId: employee._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try to find the user either in Admin or Employee collection
    let user = await Admin.findOne({ email });
    let role = 'admin'; // Default role if the user is found in the Admin collection

    // If user is not an Admin, check if they are an Employee
    if (!user) {
      user = await Employee.findOne({ email });
      role = 'employee'; // Update role if the user is found in the Employee collection
    }

    // If no user found
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a JWT token with userId and role
    const payload = { userId: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and role to the frontend
    res.json({ token, role });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
