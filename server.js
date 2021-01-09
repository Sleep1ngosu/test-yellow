const express = require('express')
const connectDB = require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ extended: false }))
app.use(express.static('uploads'))

connectDB()

app.use('/api', require('./routes/users/signin'))
app.use('/api', require('./routes/users/signup'))

app.use('/api/records', require('./routes/records/createRecord'))
app.use('/api/records', require('./routes/records/deleteRecord'))
app.use('/api/records', require('./routes/records/updateRecord'))
app.use('/api/records', require('./routes/records/getAllRecords'))
app.use('/api/records', require('./routes/records/getRecord'))
app.use('/api/records', require('./routes/records/deleteAllRecords'))

app.use('/', require('./routes/image/getImage'))
app.use('/images', require('./routes/image/getAllImage'))

app.listen(PORT, () => {
	console.log(`server is up on ${PORT}`)
})
