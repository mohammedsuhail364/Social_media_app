const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/userController');
const { protect } = require('../middlewares/index');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get User Profile (Protected Route) 
router.get('/profile', protect, getUserProfile);

// User Logout
router.post('/logout', logoutUser);

module.exports = router;
