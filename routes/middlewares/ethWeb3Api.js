const EthWeb3 = require('web3');
const winston = require('winston');

const { ETHWEB3API_URL } = process.env;

const ethWeb3ApiFn = async function ethWeb3ApiFn(req, res, next) {
	const ethWeb3Api = await new EthWeb3(
		new EthWeb3.providers.HttpProvider(ETHWEB3API_URL)
	);

	if (!ethWeb3Api.isConnected()) {
		winston.info(
			`eth web3 -> fail. Network: rinkeby.infura.io error: something wrong.`
		);
	} else {
		winston.info(`eth web3 -> success. Network: rinkeby.infura.io`);
	}
	req.ethWeb3 = ethWeb3Api;
	next();
};

module.exports = ethWeb3ApiFn;
