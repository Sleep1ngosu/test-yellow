const express = require('express')
const connectDB = require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ extended: false }))

connectDB()

app.use('/api', require('./routes/api/signin'))
app.use('/api', require('./routes/api/signup'))

app.listen(PORT, () => {
	console.log(`server is up on ${PORT}`)
})
