const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  score: { type: Number },
  dateTaken: { type: Date, default: Date.now },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
