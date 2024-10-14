const mongoose = require('mongoose');

const employeeCertificationsSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true }, 
  approvalStatus: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending'],
    default: 'Pending'
  }
});

employeeCertificationsSchema.pre('find', function() {
  this.populate('certificationId', 'certificationName'); 
});

employeeCertificationsSchema.pre('findOne', function() {
  this.populate('certificationId', 'certificationName'); 
});
const EmployeeCertifications = mongoose.model('EmployeeCertifications', employeeCertificationsSchema);
module.exports = EmployeeCertifications;
