const express = require('express')
const fs = require('fs')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')

/**
 * @swagger
 * /api/records/delete_all_records:
 *   delete:
 *     tags: ['Records']
 *     description: delete all user's records
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
 *        500:
 *          description: wrong token
 */

router.delete('/delete_all_records', auth, async (req, res) => {
	const { username } = req.body
	try {
		let user = await User.findOneAndUpdate({ username }, { records: [] })
		let userImages = []

		// user's images
		user.records.map((e) => {
			if (e.image)
				userImages.push(
					e.image.split('/')[e.image.split('/').length - 1]
				)
		})
		if (!user) return res.status(401).json({ message: 'wrong token' })

		if (user.records.length === 0) {
			return res
				.status(404)
				.json({ message: 'this user dont have any records' })
		}

		// check matching uploads images and user's images and delete them
		fs.readdir('./uploads', (err, files) => {
			if (err) throw err

			userImages.forEach((e) => {
				if (files.indexOf(e) !== -1) {
					fs.unlink(`./uploads/${e}`, (err) => {
						if (err) throw err

						console.log('file has been deleted successfully')
					})
				}
			})
		})

		res.status(200).json({
			message: 'all records has been deleted successfully',
		})
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
