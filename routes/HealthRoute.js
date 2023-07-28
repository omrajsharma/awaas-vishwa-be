const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.end('Awaas Vishwa Backend is healthy')
})

module.exports = router