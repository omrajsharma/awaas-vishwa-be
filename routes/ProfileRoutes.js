const express = require('express')
const router = express.Router()
const {getProfile} = require('../controller/ProfileController')

router.get('/', getProfile)

module.exports = router