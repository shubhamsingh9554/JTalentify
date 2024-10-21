const Skill = require('../models/Skills');
const Certification = require('../models/Certifications');
const Employee = require('../models/Employee');

exports.addSkill = async (req, res) => {
  const { skillName } = req.body;

  try {
    const newSkill = new Skill({
      skillName,
      createdBy: req.user.userId,
    });
    await newSkill.save();
    res.json(newSkill);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.addCertification = async (req, res) => {
  const { certificationName } = req.body;

  try {
    const newCertification = new Certification({
      certificationName,
      createdBy: req.user.userId,
    });
    await newCertification.save();
    res.json(newCertification);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.viewEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId)
      .populate('skills', 'skillName') // Populate only the skillName field
      .populate('certifications', 'certificationName'); // Populate only the certificationName field

    if (!employee) {
      return res.status(404).send('Employee not found');
    }
const employeeProfile = {
      ...employee._doc, // Spread existing employee details
      skills: employee.skills.map(skill => skill.skillName), // Map to get only skill names
      certifications: employee.certifications.map(cert => cert.certificationName) // Map to get only certification names
    };

    res.json(employeeProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.fetchSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.fetchCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.deleteSkill = async (req, res) => {
  try {
    const id = req.params.skillId;
    const skill = await Skill.findOneAndDelete(id);
    
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.json({ msg: 'Skill deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findOneAndDelete(req.params.certificationId);
    if (!certification) {
      return res.status(404).json({ msg: 'Certification not found' });
    }
    res.json({ msg: 'Certification deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('skills').populate('certifications');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};
