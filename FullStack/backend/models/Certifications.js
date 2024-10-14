const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  certificationName: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const Certification = mongoose.model('Certification', certificationSchema);
module.exports = Certification;
