const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
