const express = require('express');
const authController = require('./../controllers/auth-c');
const userController = require('./../controllers/user-c');
const authMW = require('./../controllers/auth-mw');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);

router.patch('/update', authController.guard, userController.updateUser);
router.patch('/update-password', authController.guard, userController.updatePassword);
router.patch('/role', authController.guard, authMW.restrictTo(['admin']), userController.changeRole);
router.delete('/delete', authController.guard, authMW.restrictTo(['admin']), userController.delUser);
router.get('/search', userController.searchUser);
router.get('/get-user', userController.getUser);
router.get('/check-user-name', userController.checkUsername);

router.get('/check-token', authController.guard, authController.checkToken);

module.exports = router;