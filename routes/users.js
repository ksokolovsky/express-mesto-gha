const express = require('express');

const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/users');
const { updateProfile, updateAvatar } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');
const { createUser } = require('../controllers/users');
//const { registrationSchema } = require('../middlewares/validationSchemas');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
//router.post('/signup', registrationSchema, createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
