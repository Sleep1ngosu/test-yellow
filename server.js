const express = require('express')
const connectDB = require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

app.use(express.json({ extended: false }))
app.use(express.static('uploads'))

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'Record&User API',
		},
	},
	tags: [
		{
			name: 'Users',
			description: `Create account and sign in`,
		},
		{
			name: 'Records',
			description: 'Everything about records',
		},
		{
			name: 'Images',
			description: 'Getting images',
		},
	],
	apis: ['./routes/image/*', './routes/records/*', './routes/users/*'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

connectDB()

app.get('/test', (req, res) => {
	res.status(200).send('lol')
})

app.use('/api', require('./routes/users/signin'))
app.use('/api', require('./routes/users/signup'))

app.use('/api/records', require('./routes/records/createRecord'))
app.use('/api/records', require('./routes/records/deleteRecord'))
app.use('/api/records', require('./routes/records/updateRecord'))
app.use('/api/records', require('./routes/records/getAllRecords'))
app.use('/api/records', require('./routes/records/getRecord'))
app.use('/api/records', require('./routes/records/deleteAllRecords'))
app.use('/api/records', require('./routes/records/getReport'))

app.use('/', require('./routes/image/getImage'))
app.use('/api/images', require('./routes/image/getAllImages'))

module.exports = app.listen(PORT, () => {
	console.log(`server is up on ${PORT}`)
})
