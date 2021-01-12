const averageTime = (hours, minutes, seconds, count) => {
	let allSeconds = hours * 60 * 60 + minutes * 60 + seconds
	let avgSeconds = allSeconds / count
	let avgTime = new Date(avgSeconds * 1000).toISOString().substr(8, 11)
	return avgTime.split('T')[1]
}

module.exports = averageTime
