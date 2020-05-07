const moment = require('moment')

const logger = (req, res, next) => {
	const time = moment().format('hh:mm:ss')

	const log = [
		`${req.protocol} `,
		`${req.method} `,
		`${req.path} `,
		`- Time: ${time}`
	]

	console.log(log.join(''))

	next()
}

module.exports = logger