const express = require('express');
// const healthCheck = require('./controllers/healthCheck');
const users = require('./controllers/users');
const wallets = require('./controllers/wallets');

const authorization = require('./middlewares/authorization');
// -- eth api
const ethWeb3Api = require('./middlewares/ethWeb3Api');
const ethGasPricesApi = require('./middlewares/ethGasPricesApi');
const ethScanApi = require('./middlewares/ethScanApi');

const router = express.Router();

// router.get('/users', users.getUsers);
// router.get(
// 	'/users/:userId',
// 	users.getSingleUserValidation,
// 	users.getSingleUser
// );
// router.post('/users', users.addEmailValidation, users.addUser);

router.post('/users', users.addEmailPostValidation, users.addUser);

router.use(authorization);

router.put(
	'/users/:email',
	users.addEmailGetValidation,
	users.addEmailPostValidation,
	users.getSingleUserByEmail,
	users.updateUser
);
router.delete(
	'/users/:email',
	users.addEmailGetValidation,
	users.getSingleUserByEmail,
	users.deleteUser
);

router.get(
	'/getBalance/:address',
	ethWeb3Api,
	users.getSingleUserByEmail,
	wallets.getBalance
);
router.get(
	'/transactionDetails/:tx',
	ethWeb3Api,
	users.getSingleUserByEmail,
	wallets.transactionDetails
);
router.post('/createWallet', users.getSingleUserByEmail, wallets.createWallet);
router.post(
	'/transaction',
	ethWeb3Api,
	ethGasPricesApi,
	users.getSingleUserByEmail,
	wallets.transaction
);

router.get(
	'/transactionList/:address',
	ethScanApi,
	users.getSingleUserByEmail,
	wallets.transactionList
);

router.get('/coinList', users.getSingleUserByEmail, wallets.coinList);
router.get(
	'/coinDetails/:symbol',
	users.getSingleUserByEmail,
	wallets.coinDetails
);
router.get(
	'/coinHistory/:symbol',
	users.getSingleUserByEmail,
	wallets.coinHistory
);
router.get(
	'/coinOnExchanges/:symbol',
	users.getSingleUserByEmail,
	wallets.coinOnExchanges
);
router.get('/exchangesList', users.getSingleUserByEmail, wallets.exchangesList);

module.exports = router;
