const request = require('supertest');
const app = require('../../app');
// const security = require('../../helpers/security');
const mongo = require('../../db/mongo');

const route = '/v1/users';

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

describe(route, () => {
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

	test(`post ${route}`, async () => {
		await request(app)
			.post(route)
			.send(validUserData)
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toHaveProperty('token');
			});
	});

	test(`put ${route}/<email>`, async () => {
		await request(app)
			.put(`${route}/${validUserData.email}`)
			.set('Authorization', `Bearer ${token}`)
			.send(validUserData)
			.expect(200)
			.expect('Content-Type', /json/)
			.expect(res => {
				expect(res.body).toHaveProperty('token');
			});
	});
});
