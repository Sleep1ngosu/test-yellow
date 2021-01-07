const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')

/**
 * route:   /api/records/get_all_records
 * desc:    read all user's records
 * access:  public
 * header:  [auth]: token
 * body:    {}
 */

router.get('/get_all_records', auth, async (req, res) => {
	const { username } = req.body
	try {
		const user = await User.findOne({ username })
		if (!user) return res.status(400).json({ message: 'wrong token' })

		res.json({ records: user.records })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
