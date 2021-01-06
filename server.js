const express = require('express')
const connectDB = require('./config/db')
const app = express()
const PORT = process.env || 5000

app.use(express.json({ extended: false }))

connectDB()

app.listen(PORT, () => {
	console.log(`server is up on ${PORT}`)
})
