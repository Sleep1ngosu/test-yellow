const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')

/**
 * @swagger
 * /api/images/get_all_images:
 *   post:
 *     tags: ['Images']
 *     description: get all user's images
 *     parameters:
 *       - name: auth
 *         in: header
 *         description: user's token
 *         required: true
 *         type: string
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

router.post('/get_all_images', auth, async (req, res) => {
	const { username } = req.body
	try {
		// find user by token's username
		const user = await User.findOne({ username })

		const images = []
		// if user have records
		if (user.records.length) {
			// if image !== null push to the images array
			user.records.forEach((e) => {
				if (e.image) images.push(e.image)
			})

			// if images.length equal to 0 user don't have images
			if (images.length === 0) {
				return res.status(404).json({
					message: 'this user dont have any images in his records',
				})
			}

			// return all user's images
			return res.status(200).json({ images })
		}

		// if user don't have any records
		res.status(404).json({ message: 'this user dont have any records' })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
