
const express = require('express')
const { loginController, registerController, authController, applyDoctorController, getAllNotificationsController, deleteAllNotificationsController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.post('/getUserData', authMiddleware, authController)
router.post('/apply-doctor', authMiddleware, applyDoctorController)
router.post('/get-all-notifications', authMiddleware, getAllNotificationsController)
router.post('/delete-all-notifications', authMiddleware, deleteAllNotificationsController)

module.exports = router