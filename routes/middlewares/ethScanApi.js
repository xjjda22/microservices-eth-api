const { ETHSCANAPI_TOKEN } = process.env;
const ethScanApi = require('etherscan-api').init(
	ETHSCANAPI_TOKEN,
	'rinkeby',
	3000
);

const winston = require('winston');

const ethScanApiFn = async function ethScanApiFn(req, res, next) {
	if (!ethScanApi.account) {
		winston.info(`eth scan -> fail. Network: rinkeby error: something wrong.`);
	} else {
		winston.info(`eth scan -> success. Network: rinkeby`);
	}
	req.ethScanApi = ethScanApi;
	next();
};

module.exports = ethScanApiFn;
