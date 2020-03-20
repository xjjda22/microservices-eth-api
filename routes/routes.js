const express = require('express');
// const users = require('./controllers/users');
const healthCheck = require('./controllers/healthCheck');
const wallets = require('./controllers/wallets');

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
// router.post('/users', users.addUserValidation, users.addUser);
// router.put('/users/:userId', users.updateUser);
// router.delete('/users/:userId', users.deleteUser);

router.get('/healthCheck', healthCheck.status);

router.get('/getBalance/:address', ethWeb3Api, wallets.getBalance);
router.get('/transactionDetails/:tx', ethWeb3Api, wallets.transactionDetails);
router.post('/createWallet', wallets.createWallet);
router.post('/transaction', ethWeb3Api, ethGasPricesApi, wallets.transaction);

router.get('/transactionList/:address', ethScanApi, wallets.transactionList);

router.get('/coinList', wallets.coinList);
router.get('/coinDetails/:symbol', wallets.coinDetails);
router.get('/coinHistory/:symbol', wallets.coinHistory);
router.get('/coinOnExchanges/:symbol', wallets.coinOnExchanges);
router.get('/exchangesList', wallets.exchangesList);

module.exports = router;
