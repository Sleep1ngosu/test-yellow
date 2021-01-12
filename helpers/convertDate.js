const convertMSToDate = (ms) => {
	// format MS since 1970y

	let date = new Date(ms)
	let year = date.getFullYear()
	let month = date.getMonth()
	let day = date.getDate()

	return `${year}/${month + 1}/${day}`
}

const convertDateToMS = (date) => {
	// format date: yyyy/m(1-12)/dd
	date = date.split('/')

	date = new Date(`${date[0]}, ${date[1]}, ${date[2]}`)

	return date
}

module.exports = { convertMSToDate, convertDateToMS }
