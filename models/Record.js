const mongoose = require('mongoose')

const RecordSchema = mongoose.Schema({
	distance: {
		type: Number,
		require: true,
	},
	time: {
		type: Number,
		require: true,
	},
	date: {
		type: Date,
		require: true,
	},
})

module.exports = Record = mongoose.model('records', RecordSchema)
