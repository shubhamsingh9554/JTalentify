const mongoose = require('mongoose');

const employeeSkillSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }, // Referencing Skill table
  competencyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  progress: {
    type: Number,  // To represent the progress as a percentage
    default: 0
  },
  approvalStatus: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending'],
    default: 'Pending'
  }
});

// Prepopulate skillName from Skill table when querying employee skill data
employeeSkillSchema.pre('find', function() {
  this.populate('skillId', 'skillName'); // Only populate the skillName field from Skill
});

employeeSkillSchema.pre('findOne', function() {
  this.populate('skillId', 'skillName'); // Only populate the skillName field from Skill
});

const EmployeeSkill = mongoose.model('EmployeeSkills', employeeSkillSchema);
module.exports = EmployeeSkill;
