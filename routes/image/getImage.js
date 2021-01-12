const express = require('express')
const router = express.Router()

// route for getting image by link

/**
 * @swagger
 * /{filepath}:
 *   get:
 *     tags: ['Images']
 *     description: get image
 *     parameters:
 *       - name: filepath
 *         in: path
 *         description: path of file
 *         example: if path is {DOMEN}/123.jpeg - filepath is 123.jpeg
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

router.get('/:filepath', async (req, res) => {
	try {
		res.sendFile(`./uploads/${req.params.filepath}`)
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
