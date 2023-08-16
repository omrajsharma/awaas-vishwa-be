const express = require('express')
const router = express.Router()
const {createItem} = require('../controller/ItemsController')

router.post('/', createItem)

module.exports = router