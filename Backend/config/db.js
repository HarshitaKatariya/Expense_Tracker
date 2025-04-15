const mongoose = require('mongoose')

const isDbConnected = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("MongoDB connected successfully")
  } catch (err) {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1) // Optional: stop server if DB connection fails
  }
}

module.exports = isDbConnected
