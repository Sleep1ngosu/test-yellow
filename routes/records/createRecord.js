const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const crypto = require('crypto')

/**
 * route:   /api/records/create
 * desc:    create record
 * access:  public
 * header:  [auth]: token
 * body:    { distance, hours, minutes, seconds, date }
 */

router.post(
	'/create',
	[
		check('distance')
			.isNumeric()
			.withMessage('should be a number (meters)'),
		check('hours').isNumeric().withMessage('should be a number'),
		check('minutes').isNumeric().withMessage('should be a number'),
		check('seconds').isNumeric().withMessage('should be a number'),
		auth,
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ error: errors.array() })

		const { distance, hours, minutes, seconds } = req.body
		const username = req.body.username
		try {
			let user = await User.findOne({ username })
			if (!user) return res.status(400).json({ message: 'invalid token' })
			let date
			if (req.body.date) {
				date = req.body.date
			} else {
				date = Date.now()
			}
			const id = crypto.randomBytes(32).toString('hex')

			const record = {
				id,
				distance: +distance,
				time: {
					hours: +hours,
					minutes: +minutes,
					seconds: +seconds,
				},
				date,
			}
			let arrRecords = [...user.records, record]
			user = await User.findOneAndUpdate(
				{ username },
				{ records: arrRecords },
				{ new: true }
			)

			res.status(200).json({ record, user })
		} catch (err) {
			res.status(500).json({ message: 'server error' })
		}
	}
)

module.exports = router
