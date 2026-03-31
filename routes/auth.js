const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { login, getMe, updateProfile, changePassword, getUsers, createUser, deleteUser } = require('../controllers/authController');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/password', protect, changePassword);
router.get('/users', protect, getUsers);
router.post('/users', protect, createUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
