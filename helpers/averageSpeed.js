const averageSpeed = (totalDistance, hours, minutes, seconds, count) => {
	let averageDistance = totalDistance / count
	let averageSeconds = (hours * 60 * 60 + minutes * 60 + seconds) / count
	console.log(averageDistance, averageSeconds)

	return +((averageDistance / averageSeconds / 1000) * 60 * 60).toFixed(2)
}

module.exports = averageSpeed
