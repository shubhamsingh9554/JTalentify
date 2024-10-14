const express = require('express');
const { addSkill, addCertification, viewEmployeeProfile, fetchSkills, fetchCertifications, deleteSkill, deleteCertification,getAllEmployees } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-skill', authMiddleware, addSkill);
router.post('/add-certification', authMiddleware, addCertification);
router.get('/employee/:employeeId', authMiddleware, viewEmployeeProfile);
router.get('/employees', authMiddleware, getAllEmployees);

// New routes to fetch skills and certifications
router.get('/skills', authMiddleware, fetchSkills);
router.get('/certifications', authMiddleware, fetchCertifications);

// New routes to delete skills and certifications
router.delete('/skills/:skillId', authMiddleware, deleteSkill);
router.delete('/certifications/:certificationId', authMiddleware, deleteCertification);

module.exports = router;

