// const winston = require('winston');
const mongo = require('../../db/mongo');

const status = async (req, res) => {
	try {
		res.status(200).send({
			uptime: Math.round(process.uptime()),
			message: 'OK',
			timestamp: Date.now(),
			mongodb: mongo.isConnected()
		});
	} catch (e) {
		res.status(503).end();
	}
};

module.exports = {
	status
};
