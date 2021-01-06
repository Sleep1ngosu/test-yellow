const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
})

module.exports = User = mongoose.model('users', UserSchema)
