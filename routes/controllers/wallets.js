// const { celebrate, Joi } = require('celebrate');
const winston = require('winston');
const axios = require('axios');

// -- eth api
const bip39 = require('bip39');
const ethWallet = require('ethereumjs-wallet/hdkey');
const EthTxn = require('ethereumjs-tx');
// const ethScanApi = require('etherscan-api').init(process.env.ETHSCANAPI_TOKEN,'rinkeby', 3000);

const createWallet = (req, res) => {
	const path = "m/44'/60'/0'/0"; // ethereum
	// path = "m/"+req.params.path+"/"+req.params.coin+"'/0'/0";
	const index = 0;
	// index = req.params.index,

	const mnemonic = bip39.generateMnemonic(); // generates string
	// mnemonic = 'cook balance apple fork swallow early program refuse vicious month patient viable';
	const seed = bip39.mnemonicToSeed(mnemonic); // creates seed buffer

	let wallet = ethWallet.fromMasterSeed(seed);
	wallet = wallet.derivePath(path);
	wallet = wallet.deriveChild(index);
	const cwallet = wallet.getWallet();

	// const xpriv = wallet.privateExtendedKey();
	// const xpub = wallet.publicExtendedKey();

	const privatekey = cwallet.getPrivateKey().toString('hex');
	const address = `0x${cwallet.getAddress().toString('hex')}`;

	// console.log('mnemonic->',mnemonic);
	// console.log('seed->',seed);
	// console.log('wallet->',wallet);
	// console.log('cwallet->',cwallet);
	// console.log('privatekey->',privatekey);
	// console.log('address->',address);

	res.status(200).send({
		mnemonic,
		address,
		privatekey
	});
};

const getBalance = async ({ params: { address }, ethWeb3 }, res) => {
	// console.log('address->',address);
	// console.log('ethWeb3->',ethWeb3);

	await ethWeb3.eth.getBalance(address, function getBalanceResult(
		error,
		result
	) {
		if (error) {
			winston.info(`getBalance -> fail. error: `, error);

			res.status(200).send({
				error
			});
		} else {
			winston.info(`getBalance -> success. result: `, result);
			const balance = ethWeb3.fromWei(result.toString(), 'ether');
			winston.info(`getBalance -> success. balance: `, balance);

			res.status(200).send({
				balance
			});
		}
	});
};

// rinkerby ethereum faucet
// account refer keyrock-testing-accounts
// walletAddress[0] = {
// 'publickey':'0x70DeFb7B30D575758ea0405ff26C3646CcCa0E10',
// 'privatekey':''
// };
// ether-2.01

// walletAddress[1] = {
// 'publickey':'0x2d0e6fbef8e7322e59fb666be326a3ad88704718',
// 'privatekey':''
// };
// ether-7.6

// walletAddress[2] = {
// 'publickey':'0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e',
// 'privatekey':''
// };
// ether-0.22

const transaction = (
	{ body: { privatekey, destination, amount, send }, ethWeb3, ethGasPrices },
	res
) => {
	// console.log('ethWeb3->',ethWeb3);
	// console.log('ethGasPrices->',ethGasPrices);

	const details = {
		to: destination,
		value: ethWeb3.toHex(ethWeb3.toWei(amount, 'ether')),
		gas: 21000,
		gasPrice: ethGasPrices.low * 1000000000, // converts the gwei price to wei
		// "nonce": nonce,
		nonce: '0x00',
		chainId: 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
	};

	let tx = new EthTxn(details);
	tx.sign(Buffer.from(privatekey, 'hex'));

	let serializedTransaction = tx.serialize();
	let getSenderAddress = `0x${tx.getSenderAddress().toString('hex')}`;

	winston.info(`tx -> . serializedTransaction-before: `, serializedTransaction);
	winston.info(`tx -> . getSenderAddress-before: `, getSenderAddress);

	ethWeb3.eth.getTransactionCount(
		getSenderAddress,
		function getTransactionCountResult(error, result) {
			if (error) {
				winston.info(`eth web3 tx count -> fail. error: `, error);
				res.status(200).send({
					ethGasPrices,
					getSenderAddress,
					error
				});
			} else {
				winston.info(`eth web3 tx count -> success. sender: `, result);
				const nonce = result;
				details.nonce = nonce;

				winston.info(`tx -> . nonce-after: `, nonce);
				winston.info(`tx -> . details-after: `, details);

				tx = new EthTxn(details);
				tx.sign(Buffer.from(privatekey, 'hex'));

				serializedTransaction = tx.serialize();
				getSenderAddress = `0x${tx.getSenderAddress().toString('hex')}`;

				winston.info(
					`tx -> . serializedTransaction-after: `,
					serializedTransaction
				);
				winston.info(`tx -> . getSenderAddress-after: `, getSenderAddress);

				if (send) {
					ethWeb3.eth.sendRawTransaction(
						`0x${tx.getSenderAddress().toString('hex')}`,
						function sendRawTransactionResult(errorRawTx, resultRawTx) {
							if (error) {
								winston.info(`eth web3 send tx -> fail. error: `, errorRawTx);

								res.status(200).send({
									ethGasPrices,
									getSenderAddress,
									error: errorRawTx
								});
							} else {
								winston.info(
									`eth web3 tx count -> success. transactionId: `,
									resultRawTx
								);

								const url = `https://rinkeby.etherscan.io/tx/${resultRawTx}`;

								res.status(200).send({
									ethGasPrices,
									transactionId: resultRawTx,
									transactionUrl: url,
									getSenderAddress
								});
							}
						}
					);
				} else {
					res.status(200).send({
						ethGasPrices,
						getSenderAddress
					});
				}
			}
		}
	);
};

// tx -> 0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f

const transactionDetails = ({ params: { tx }, ethWeb3 }, res) => {
	// console.log('tx->',tx);
	// console.log('ethWeb3->',ethWeb3);

	ethWeb3.eth.getTransaction(tx, function getTransactionResult(error, result) {
		if (error) {
			winston.info(`eth web3 transaction details -> fail. error: `, error);
			res.status(200).send({
				error
			});
		} else {
			winston.info(`eth web3 transaction count -> success. sender: `, result);

			res.status(200).send({
				blockHash: result.blockHash,
				blockNumber: result.blockNumber,
				fromAddress: result.from,
				toAddress: result.to,
				amount: ethWeb3.fromWei(result.value, 'ether'),
				gas: result.gas,
				gasPrice: result.gasPrice
			});
		}
	});
};

// address -> 0x2d0e6fbef8e7322e59fb666be326a3ad88704718

const transactionList = ({ params: { address }, ethScanApi }, res) => {
	// console.log('address->',address);

	ethScanApi.account
		.txlist(address, '1', 'latest', 1, 10, 'asc')
		.then(result => {
			res.status(200).send(result);
		})
		.catch(error => {
			winston.info(`eth scan api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

const coinList = (req, res) => {
	axios
		.get('https://api.coincap.io/v2/assets?limit=20')
		.then(({ data }) => {
			// handle success
			winston.info(`eth coin api -> success. data: `, data);

			res.status(200).send(data);
		})
		.catch(error => {
			winston.info(`eth coin api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

// symbol -> bitcoin
// symbol -> ethereum
// symbol -> bitcoin-cash
// symbol -> bitcoin-sv
// symbol -> litecoin
// symbol -> eos
// symbol -> binance-coin
// symbol -> tezos

const coinDetails = ({ params: { symbol } }, res) => {
	axios
		.get(`https://api.coincap.io/v2/assets/{symbol}`)
		.then(({ data }) => {
			// handle success
			winston.info(`eth coin api -> success. data: `, data);
			res.status(200).send(data);
		})
		.catch(error => {
			winston.info(`eth coin api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

const coinHistory = ({ params: { symbol } }, res) => {
	axios
		.get(`https://api.coincap.io/v2/assets/{symbol}/history?interval=d1`)
		.then(({ data }) => {
			// handle success
			winston.info(`eth coin api -> success. data: `, data);
			res.status(200).send(data);
		})
		.catch(error => {
			winston.info(`eth coin api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

const coinOnExchanges = ({ params: { symbol } }, res) => {
	axios
		.get(`https://api.coincap.io/v2/assets/{symbol}/markets?limit=20`)
		.then(({ data }) => {
			// handle success
			winston.info(`eth coin api -> success. data: `, data);
			res.status(200).send(data);
		})
		.catch(error => {
			winston.info(`eth coin api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

const exchangesList = (req, res) => {
	axios
		.get('https://api.coincap.io/v2/markets')
		.then(({ data }) => {
			// handle success
			winston.info(`eth coin api -> success. data: `, data);
			res.status(200).send(data);
		})
		.catch(error => {
			winston.info(`eth coin api -> fail. error: `, error);
			res.status(200).send({
				error
			});
		});
};

module.exports = {
	createWallet,
	getBalance,
	transaction,
	transactionDetails,
	transactionList,
	coinList,
	coinDetails,
	coinHistory,
	coinOnExchanges,
	exchangesList
};
