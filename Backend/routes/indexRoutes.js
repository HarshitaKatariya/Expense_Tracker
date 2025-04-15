const express = require('express')
const userRouter = require('./userRoutes')
const incomeRouter = require('./incomRoutes')
const expenseRouter = require('./expenseRoutes')
const authRouter = require('./authRoutes')
const dashboard = require('./dashboard')

const router = express.Router();

router.use('/user',userRouter)
router.use('/income',incomeRouter)
router.use('/expense',expenseRouter)
router.use('/authRouter',authRouter)
router.use('/dashboard',dashboard)


module.exports = router;
