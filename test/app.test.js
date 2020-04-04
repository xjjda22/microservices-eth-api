const request = require('supertest');
const app = require('../app');
// const security = require('../helpers/security');
const mongo = require('../db/mongo');

describe('Server', () => {
	beforeAll(async () => {
		await mongo.connectWithRetry();
	});

	afterAll(() => mongo.disconnect());

	test('healthcheck', async () => {
		await request(app)
			.get('/healthcheck')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body.mongodb).toBeTruthy();
				expect(res.body.uptime).toBeGreaterThan(0);
			});
	});
});
