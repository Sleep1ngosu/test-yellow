const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')

/**
 * route:   /api/records/get_record/:id
 * desc:    get user's record by id
 * access:  public
 * header:  [auth]: token
 * body:    {}
 */

router.get('/get_record/:id', auth, async (req, res) => {
	const { username } = req.body
	try {
		let user = await User.findOne({ username })
		let record = user.records.filter((e) => e.id === req.params.id)
		if (!record)
			return res
				.status(404)
				.json({ message: 'record with this id is not found' })

		res.status(200).json({ record })
	} catch (err) {
		res.status(500).json({ message: 'server error' })
	}
})

module.exports = router
