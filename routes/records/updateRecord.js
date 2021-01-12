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

/**
 * @swagger
 * /api/records/update:
 *   put:
 *     tags: ['Records']
 *     description: edit record
 *     parameters:
 *       - name: auth
 *         in: header
 *         description: user's token
 *         required: true
 *         type: string
 *       - name: id
 *         in: formData
 *         description: record's id
 *         required: true
 *         type: string
 *       - name: distance
 *         in: formData
 *         required: false
 *         type: number
 *       - name: hours
 *         in: formData
 *         required: false
 *         type: number
 *       - name: minutes
 *         in: formData
 *         required: false
 *         type: number
 *       - name: seconds
 *         in: formData
 *         required: false
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
 *        404:
 *          description: not found
 *        500:
 *          description: wrong token
 */

router.put('/update', [upload.single('image'), auth], async (req, res) => {
	const { id, username } = req.body
	const time = {
		hours: +req.body.hours,
		minutes: +req.body.minutes,
		seconds: +req.body.seconds,
	}
	try {
		// choose only fields that body exists (time)
		for (let t in time) {
			if (!time[t]) delete time[t]
		}

		// convert distance to a number
		if (req.body.distance) {
			req.body.distance = +req.body.distance
		}
		let user = await User.findOne({ username })

		// deconstruct body to an updated record (except username)
		let updatedRecord = { ...req.body }
		delete updatedRecord.username

		// find user's record by id
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

		// index of this record in user's records
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
			image: `http://localhost:5000/${filepath}`,
		}
		delete userRecords[index].hours
		delete userRecords[index].seconds
		delete userRecords[index].minutes

		user = await User.findOneAndUpdate(
			{ username },
			{ records: userRecords },
			{ new: true }
		)
		res.status(200).json({ record: userRecords[index] })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
