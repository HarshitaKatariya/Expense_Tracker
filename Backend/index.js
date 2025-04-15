const express = require('express')
const rootRouter = require('./routes/indexRoutes')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const isDbConnected = require('./config/db');
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

isDbConnected()
app.use('/api/v1', rootRouter)
app.use('/uploads',express.static(path.join(__dirname,"uploads")));

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`)
})