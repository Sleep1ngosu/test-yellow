const express = require('express')
const app = express()
const PORT = process.env || 5000

app.use(express.json({ extended: false }))

app.listen(PORT, () => {
	console.log(`server is up on ${PORT}`)
})
