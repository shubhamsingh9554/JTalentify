const express = require('express');
const { getEmployeeProfile, addEmployeeSkill, addEmployeeCertification,updateSkillProgress } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getEmployeeProfile);
router.post('/add-skill', authMiddleware, addEmployeeSkill);
router.post('/add-certification', authMiddleware, addEmployeeCertification);
router.post('/skill/progress', authMiddleware, updateSkillProgress);

module.exports = router;
