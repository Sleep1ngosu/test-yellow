const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')

/**
 * route:   /api/records/update
 * desc:    update record by id
 * access:  public
 * header:  [auth]: token
 * body:    { id, distance?, hours?, minutes?, seconds?, date? }
 */

router.put('/update', auth, async (req, res) => {
	const { id, username } = req.body
	const time = {
		hours: +req.body.hours,
		minutes: +req.body.minutes,
		seconds: +req.body.seconds,
	}
	try {
		for (let t in time) {
			if (!time[t]) delete time[t]
		}
		req.body.distance = +req.body.distance
		let user = await User.findOne({ username })
		let updatedRecord = { ...req.body }
		delete updatedRecord.username
		let userRecords = user.records
		let record = undefined
		userRecords.forEach((e) => {
			if (e.id === id) {
				record = e
			}
		})
		if (!record)
			return res
				.status(404)
				.json({ message: 'record with this id is not found' })

		let index = userRecords.indexOf(record)
		userRecords[index] = {
			...userRecords[index],
			...updatedRecord,
			time: { ...userRecords[index].time, ...time },
		}
		delete userRecords[index].hours
		delete userRecords[index].seconds
		delete userRecords[index].minutes

		user = await User.findOneAndUpdate(
			{ username },
			{ records: userRecords },
			{ new: true }
		)

		res.status(200).json({ user, record: userRecords[index] })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
