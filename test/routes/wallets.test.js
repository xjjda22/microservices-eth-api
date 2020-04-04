const request = require('supertest');
const app = require('../../app');
// const security = require('../../helpers/security');
const mongo = require('../../db/mongo');

const route = '/v1/users';
const wallets = 'wallets api';
// const getBalance = '/v1/getBalance';
// const transactionDetails = '/v1/transactionDetails';
// const transactionList = '/v1/transactionList';
const coinList = '/v1/coinList';

// const address = '0x70DeFb7B30D575758ea0405ff26C3646CcCa0E10';
// const tx = '0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f';

// const tokenPayload = {
// 	jti: '123',
// 	email: 'test@example.com'
// };

const validUserData = {
	email: 'test@example.com'
};

// const invalidUserData = {
// 	mail: 'testt@example.com'
// };

// const delay = ms => setTimeout(() => Promise.resolve(), ms);
// await delay(200);

describe(wallets, () => {
	let token = null;

	beforeAll(async () => {
		await mongo.connectWithRetry();
		// token = await security.getSignedToken(tokenPayload);
		await request(app)
			.post(route)
			.send(validUserData)
			.then(res => {
				token = res.body.token;
			});
	});

	afterAll(() => mongo.disconnect());

	// test(`get ${getBalance}/<address>`, async () => {
	// 	await request(app)
	// 		.get(`${getBalance}/${address}`)
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.then(res => {
	// 			expect(res.body).toHaveProperty('balance');
	// 		});
	// }, 10000);

	// test(`get ${transactionDetails}/<tx>`, async () => {
	// 	await request(app)
	// 		.get(`${transactionDetails}/${tx}`)
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.then(res => {
	// 			expect(res.body).toHaveProperty('blockHash');
	// 			expect(res.body).toHaveProperty('blockNumber');
	// 			expect(res.body).toHaveProperty('amount');
	// 		});
	// }, 10000);

	// test(`get ${transactionList}/<address>`, async () => {
	// 	await request(app)
	// 		.get(`${transactionList}/${address}`)
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.then(res => {
	// 			expect(res.body).toHaveProperty('status');
	// 			expect(res.body).toHaveProperty('message');
	// 			expect(res.body).toHaveProperty('result');
	// 			expect(Array.isArray(res.body.result)).toEqual(true);
	// 		});
	// }, 10000);

	test(`get ${coinList}`, async () => {
		await request(app)
			.get(coinList)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toHaveProperty('data');
				expect(Array.isArray(res.body.data)).toEqual(true);
			});
	});
});
