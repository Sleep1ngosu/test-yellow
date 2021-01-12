const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { convertDateToMS } = require('../../helpers/convertDate')
const { check, validationResult } = require('express-validator')
const averageTime = require('../../helpers/averageTime')
const averageSpeed = require('../../helpers/averageSpeed')

/**
 * @swagger
 * /api/records/get_report:
 *   post:
 *     tags: ['Records']
 *     description: get report about running records
 *     parameters:
 *       - name: auth
 *         in: header
 *         description: user's token
 *         required: true
 *         type: string
 *       - name: body
 *         description: start date of report's period (yyyy/m(1-12)/dd)
 *         example: { startDate: 2020/2/15, endDate: 2020/2/20 }
 *         in: body
 *         required: true
 *         type: object
 *     responses:
 *        200:
 *          description: record has been created successfully
 *        400:
 *          description: bad request
 *        404:
 *          description: not found
 *        500:
 *          description: wrong token
 */

router.post(
	'/get_report',
	[
		check('startDate').not().isEmpty().withMessage('startDate is required'),
		check('endDate').not().isEmpty().withMessage('endDate is required'),
		auth,
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ message: errors.array() })

		const { username } = req.body
		let { startDate, endDate } = req.body
		try {
			const user = await User.findOne({ username })
			if (!user)
				return res.status(404).json({ message: 'user is not found' })

			let start = convertDateToMS(startDate)
			let end = convertDateToMS(endDate)

			let records = user.records

			if (!records.length)
				return res
					.status(404)
					.json({ message: `you don't have any records` })

			let matchingRecords = []
			let avgTime,
				avgSpeed,
				totalHours = 0,
				totalMinutes = 0,
				totalSeconds = 0,
				totalDistance = 0

			records.forEach((e) => {
				let curDate = convertDateToMS(e.date)

				if (curDate >= start && curDate <= end) {
					matchingRecords.push(e)
					totalDistance += e.distance
					totalHours += e.time.hours
					totalMinutes += e.time.minutes
					totalSeconds += e.time.seconds
				}
			})

			if (!matchingRecords.length)
				return res.status(404).json({
					message: `you don't have any records during this period`,
				})

			avgTime = averageTime(
				totalHours,
				totalMinutes,
				totalSeconds,
				matchingRecords.length
			)

			avgSpeed = averageSpeed(
				totalDistance,
				totalHours,
				totalMinutes,
				totalSeconds,
				matchingRecords.length
			)

			res.json({
				interval: `${startDate} - ${endDate}`,
				totalDistance: `${totalDistance} meters`,
				avgTime,
				avgSpeed: `${avgSpeed} km/h`,
				avgDistance: `${+(
					totalDistance / matchingRecords.length
				).toFixed(2)} meters`,
				totalRecords: matchingRecords.length,
			})
		} catch (err) {
			res.status(500).json({ message: 'server error' })
		}
	}
)

module.exports = router
