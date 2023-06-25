
const express = require('express');
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

const router = express.Router();

router.post('/signUp' ,authController.signUp)
router.post('/login' ,authController.login)
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)
router.post('/verifyCode', authController.verifyCode)
router.post('/resetPassword/:resetToken', authController.resetPassword)

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;

