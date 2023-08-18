const express = require('express')
const router = express.Router()
const {createItem, getItems} = require('../controller/ItemsController')

router.post('/', createItem)
router.get('/', getItems)

module.exports = router