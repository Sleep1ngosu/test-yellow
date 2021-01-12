const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const crypto = require('crypto')
const createMulterUpload = require('../../helpers/createMulterUpload')
const upload = createMulterUpload()
const { convertMSToDate } = require('../../helpers/convertDate')

/**
 * @swagger
 * /api/records/create:
 *   post:
 *     tags: ['Records']
 *     description: create a new running record
 *     parameters:
 *       - name: auth
 *         in: header
 *         description: user's token
 *         required: true
 *         type: string
 *       - name: distance
 *         in: formData
 *         required: true
 *         type: number
 *       - name: hours
 *         in: formData
 *         required: true
 *         type: number
 *       - name: minutes
 *         in: formData
 *         required: true
 *         type: number
 *       - name: seconds
 *         in: formData
 *         required: true
 *         type: number
 *       - name: image
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
 *        200:
 *          description: record has been created successfully
 *        400:
 *          description: bad request
 *        500:
 *          description: wrong token
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
			let date = req.body.date
			// record's date (default Date.now())
			if (!req.body.date) {
				date = Date.now()
				date = convertMSToDate(date)
			}
			// id for record
			const id = crypto.randomBytes(32).toString('hex')

			// create filepath for database (image)
			let filePath
			req.file
				? (filePath = `localhost:5000/${req.file.filename}`)
				: (filePath = null)

			// create record instance for db
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

			// push record to all user's records
			let arrRecords = [...user.records, record]
			user = await User.findOneAndUpdate(
				{ username },
				{ records: arrRecords },
				{ new: true }
			)
			res.status(200).json({ record })
		} catch (err) {
			res.status(500).json({ message: 'server error' })
		}
	}
)

module.exports = router
