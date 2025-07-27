const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User registration
router.post('/signup', authController.signup);

// User login
router.post('/signin', authController.login);

module.exports = router;