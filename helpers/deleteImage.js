const fs = require('fs')

const deleteImage = (image) => {
	fs.readdir('./uploads', (err, files) => {
		if (err) throw err

		let path = files.filter((e) => e === image)

		fs.unlink(`./uploads/${path}`, (err) => {
			if (err) throw err

			console.log(`file ${path} has been deleted successfully`)
			return
		})
	})
}

module.exports = deleteImage
