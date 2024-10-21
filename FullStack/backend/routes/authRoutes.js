const express = require('express');
const { registerAdmin, registerEmployee, login } = require('../controllers/authController');
const router = express.Router();

router.post('/admin/register', registerAdmin);
router.post('/employee/register', registerEmployee);
router.post('/login', login);

module.exports = router;
