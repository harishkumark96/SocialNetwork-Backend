const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.GetAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.GetUser);
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.GetUserByName);

module.exports = router;
