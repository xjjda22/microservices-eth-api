// const ethWeb3 = require('web3');
// const ethWallet = require('ethereumjs-wallet/hdkey');
// const bip39 = require('bip39');
// const hdkey = require('hdkey');
// const ethUtil = require('ethjs-util');
// const ethTx = require('ethereumjs-tx');
const axios = require('axios');

const winston = require('winston');

const ethGasPricesApiFn = async function ethGasPricesApiFn(req, res, next) {
	const response = await axios.get(
		'https://ethgasstation.info/json/ethgasAPI.json'
	);
	const prices = {
		low: response.data.safeLow / 10,
		medium: response.data.average / 10,
		high: response.data.fast / 10
	};
	winston.info(
		`eth gas -> success. Network: ethgasstation.info prices:`,
		prices
	);

	req.ethGasPrices = prices;
	next();
};

module.exports = ethGasPricesApiFn;
