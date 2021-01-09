const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const deleteImage = require('../../helpers/deleteImage')

/**
 * route:   /api/records/delete/:id
 * desc:    delete record by its id
 * access:  public
 * header:  [auth]: token
 * body:    {}
 */

router.delete('/delete/:id', auth, async (req, res) => {
	const { username } = req.body
	const id = req.params.id
	try {
		let user = await User.findOne({ username })
		let records = user.records
		let isRecord = false

		records.forEach((e) => {
			if (e.id === id) {
				isRecord = true
			}
		})

		if (!isRecord)
			return res
				.status(404)
				.json({ message: 'record with this id is not found' })

		let newRecords = records.filter((e) => e.id !== id)

		// record's image by id (choosed from all user's records)
		let image = null
		records.forEach((e) => {
			if (e.id === id) {
				image = e.image
			}
		})
		if (image) {
			image = image.split('/')[image.split('/').length - 1]
			deleteImage(image)
		}

		if (newRecords.length === records.length)
			return res
				.status(404)
				.json({ message: 'record with this id is not found' })

		user = await User.findOneAndUpdate(
			{ username },
			{ records: newRecords },
			{ new: true }
		)

		res.status(200).json({
			user,
			message: 'record has been removed successfully',
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})

module.exports = router
