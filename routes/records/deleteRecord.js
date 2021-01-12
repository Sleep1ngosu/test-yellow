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

/**
 * @swagger
 * /api/records/delete/{id}:
 *   delete:
 *     tags: ['Records']
 *     description: delete records by its id
 *     parameters:
 *       - name: auth
 *         in: header
 *         description: user's token
 *         required: true
 *         type: string
 *       - name: id
 *         description: record's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *        200:
 *          description: record has been created successfully
 *        400:
 *          description: bad request
 *        500:
 *          description: wrong token
 */

router.delete('/delete/:id', auth, async (req, res) => {
	const { username } = req.body
	const id = req.params.id
	try {
		let user = await User.findOne({ username })
		let records = user.records

		// find record for this id
		let isRecord = records.filter((e) => e.id === id)

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

		// if this record exists image delete this image
		if (image) {
			image = image.split('/')[image.split('/').length - 1]
			deleteImage(image)
		}

		// if nothing has been deleted record not found
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
			message: 'record has been removed successfully',
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})

module.exports = router
