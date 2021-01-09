const multer = require('multer')

const createMulterUpload = () => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './uploads/')
		},
		filename: function (req, file, cb) {
			cb(
				null,
				new Date().toISOString().replace(/:/g, '-') + file.originalname
			)
		},
	})

	const upload = multer({
		storage,
		limits: {
			fileSize: 1024 * 1024,
		},
	})

	return upload
}

module.exports = createMulterUpload
