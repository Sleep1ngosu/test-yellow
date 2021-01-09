const express = require('express')
const router = express.Router()

router.get('/:filepath', async (req, res) => {
	// console.log('hello')
	try {
		res.sendFile(`./uploads/${req.params.filepath}`)
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
