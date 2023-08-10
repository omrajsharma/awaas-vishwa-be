const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logoutUser, profileCheck } = require('../controller/AuthController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/profile', profileCheck)

module.exports = router