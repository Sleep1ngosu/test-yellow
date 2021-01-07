const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
		trim: true,
	},
	password: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	records: {
		type: Array,
		default: [],
	},
})

module.exports = User = mongoose.model('users', UserSchema)
