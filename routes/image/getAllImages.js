const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')

router.get('/get_all_images', auth, async (req, res) => {
	const { username } = req.body
	try {
		const user = await User.findOne({ username })

		const images = []
		if (user.records.length) {
			user.records.forEach((e) => {
				if (e.image) images.push(e.image)
			})

			if (images.length === 0) {
				return res
					.status(404)
					.json({
						message:
							'this user dont have any images in his records',
					})
			}

			return res.status(200).json({ images })
		}

		res.status(404).json({ message: 'this user dont have any records' })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
