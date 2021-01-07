const jwt = require('jsonwebtoken')
const config = require('config')

const auth = (req, res, next) => {
	const token = req.headers['auth']
	if (!token) return res.status(400).json({ message: 'token is required' })
	try {
		const user = jwt.verify(token, config.get('jwtSecret'))
		if (!user) return res.status(400).json({ message: 'token is wrong' })

		req.body.username = user.username
		next()
	} catch (err) {
		res.status(500).json({ error: err })
	}
}

module.exports = auth
