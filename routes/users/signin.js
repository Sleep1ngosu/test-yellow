const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const config = require('config')
const { check, validationResult } = require('express-validator')

//body { username, password }
router.post(
	'/sign_in',
	[
		check('username').not().isEmpty().withMessage('username is required'),
		check('password').not().isEmpty().withMessage('password is required'),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })

		const { username, password } = req.body

		try {
			let user = await User.findOne({ username })
			if (!user)
				return res.status(404).json({ message: 'invalid username' })

			const match = await bcrypt.compare(password, user.password)
			if (!match)
				return res.status(400).json({ message: 'invalid password' })

			const payload = {
				username,
				id: user.id,
			}

			jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
				if (err)
					return res
						.status(401)
						.json({ message: 'cant generate token' })

				res.status(200).json({ user, token })
			})
		} catch (err) {
			res.status(500).json({ message: 'server error' })
		}
	}
)

module.exports = router
