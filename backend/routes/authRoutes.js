const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

console.log('Auth Routes loaded');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;