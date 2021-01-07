const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

//body { username, password, email }

router.post(
	'/sign_up',
	[
		check('username').not().isEmpty().withMessage('username is required'),
		check('password').not().isEmpty().withMessage('password is required'),
		check('email')
			.not()
			.isEmpty()
			.withMessage('email is required')
			.isEmail()
			.withMessage('incorrect email'),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })
		const { username, password, email } = req.body

		try {
			let user = await User.findOne({ username })
			if (user)
				return res.status(400).json({
					message: 'User with this username is already exists',
				})
			user = await User.findOne({ email })
			if (user)
				return res
					.status(400)
					.json({ message: 'User with this email is already exists' })

			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			user = new User({
				username,
				password: hash,
				email,
			})

			await user.save()

			res.status(200).json({
				user,
				message: 'User has been successfully created',
			})
		} catch (err) {
			res.status(500).json({ message: 'server error' })
		}
	}
)

module.exports = router
