
const Employee = require('../models/Employee');
const EmployeeSkills = require('../models/EmployeeSkills');
const EmployeeCertifications = require('../models/EmployeeCertifications');
const Skill = require('../models/Skills');
const Certification = require('../models/Certifications');
const mongoose = require('mongoose');

exports.getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.userId)
      .populate('skills')
      .populate('certifications');
      
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const skillsWithNames = await Promise.all(
      employee.skills.map(async (empSkill) => {
        const skill = await Skill.findById(empSkill.skillId);
        return {
          _id: empSkill._id,
          skillName: skill.skillName,
          competencyLevel: empSkill.competencyLevel,
          progress: empSkill.progress
        };
      })
    );
    const certsWithNames = await Promise.all(
      employee.certifications.map(async (empCert) => {
        const cert = await Certification.findById(empCert.certificationId);
        return {
          _id: empCert._id,
          certificationName: cert.certificationName,
        };
      })
    );

    res.json({
      name: employee.name,
      email: employee.email,
      skills: skillsWithNames,
      certifications: certsWithNames,
    });
  } catch (error) {
    console.error("Server error occurred:", error.message);
    res.status(500).send('Server error');
  }
};

exports.addEmployeeSkill = async (req, res) => {
  const { skillId, competencyLevel } = req.body;
  let progress = 0;

  try {
    const newSkill = new EmployeeSkills({
      employeeId: req.user.userId,
      skillId,
      competencyLevel,
      progress,
    });
    await newSkill.save();

    await Employee.findByIdAndUpdate(req.user.userId, {
      $push: { skills: newSkill._id },
    });

    res.json(newSkill);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateSkillProgress = async (req, res) => {
  const { skillId, progress } = req.body;
console.log(req.user.userId, progress, skillId);
const employeeObjectId = new mongoose.Types.ObjectId(req.user.userId);
    const skillObjectId = new mongoose.Types.ObjectId(skillId);
  try {
    const skill = await EmployeeSkills.findOne({
      _id: skillId,
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found for this employee' });
    }

    skill.progress = progress; 
    await skill.save();

    res.json({ message: 'Skill progress updated successfully', skill });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
exports.addEmployeeCertification = async (req, res) => {
  const { certificationId } = req.body;

  try {
    const newCertification = new EmployeeCertifications({
      employeeId: req.user.userId,
      certificationId,
    });
    await newCertification.save();

    await Employee.findByIdAndUpdate(req.user.userId, {
      $push: { certifications: newCertification._id },
    });

    res.json(newCertification);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
