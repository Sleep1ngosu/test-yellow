const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const crypto = require('crypto')
const createMulterUpload = require('../../helpers/createMulterUpload')
const upload = createMulterUpload()

/**
 * route:   /api/records/create
 * desc:    create record
 * access:  public
 * header:  [auth]: token
 * body:    { distance, hours, minutes, seconds, date, image }
 */

router.post(
	'/create',
	[
		check('distance')
			.not()
			.isNumeric()
			.withMessage('should be a number (meters)'),
		check('hours').not().isNumeric().withMessage('should be a number'),
		check('minutes').not().isNumeric().withMessage('should be a number'),
		check('seconds').not().isNumeric().withMessage('should be a number'),
		upload.single('image'),
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

			// create filepath for database
			let filePath
			req.file
				? (filePath = `localhost:5000/${req.file.filename}`)
				: (filePath = null)

			const record = {
				id,
				distance: +distance,
				time: {
					hours: +hours,
					minutes: +minutes,
					seconds: +seconds,
				},
				date,
				image: filePath,
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
