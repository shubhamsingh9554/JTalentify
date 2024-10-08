const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String },
  role: { type: String },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeSkills' }],
  certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeCertifications' }],
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
