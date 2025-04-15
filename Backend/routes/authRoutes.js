const express = require('express')
const { signup, signin, getUserInfo } = require('../controller/authController')
const  userMiddle  = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.get('/getUserInfo',userMiddle, getUserInfo)


module.exports = router;