const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const deleteImage = require('../../helpers/deleteImage')
const createMulterUpload = require('../../helpers/createMulterUpload')
const upload = createMulterUpload()

/**
 * route:   /api/records/update
 * desc:    update record by id
 * access:  public
 * header:  [auth]: token
 * body:    { id, distance?, hours?, minutes?, seconds?, date? }
 */

router.put('/update', [upload.single('image'), auth], async (req, res) => {
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

		// create filepath which at start equal to OLD RECORD'S IMAGE
		let filepath = userRecords[index].image.split('/')[
			userRecords[index].image.split('/').length - 1
		]

		if (req.file) {
			// delete old picture binded with this record
			deleteImage(filepath)
			// make variable binded with new image
			filepath = req.file.filename
		}

		userRecords[index] = {
			...userRecords[index],
			...updatedRecord,
			time: { ...userRecords[index].time, ...time },
			image: filepath,
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
