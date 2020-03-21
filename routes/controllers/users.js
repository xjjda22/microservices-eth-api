const winston = require('winston');
const { celebrate, Joi } = require('celebrate');
const usersService = require('../../services/users');
const security = require('../../helpers/security');
const util = require('../../helpers/util');

// const getUsers = async ({ params }, res) => {
// 	const users = await usersService.getUsers();
// 	res.status(200).send(users);
// };

const { JWT_JTI, JWT_SECRET } = process.env;

const getSingleUserByEmail = async (req, res, next) => {
	const {
		jwt: { email }
	} = req;
	const user = await usersService.getSingleUserByEmail(email);
	winston.info(`getuser -> user: `, user);
	if (!util.isEmpty(user)) {
		req.mangodb = {};
		req.mangodb.rec = user;
		next();
	} else {
		res.status(200).send({
			error: 'user not found'
		});
	}
};

const addEmailGetValidation = celebrate({
	params: {
		email: Joi.string()
			.email()
			.required()
	}
});

const addEmailPostValidation = celebrate({
	body: {
		email: Joi.string()
			.email()
			.required()
	}
});

const addUser = async ({ body }, res) => {
	const { email } = body;
	const tokenPayload = {
		jti: JWT_JTI,
		secret: JWT_SECRET,
		email
	};
	const token = await security.getSignedToken(tokenPayload);
	const user = await usersService.addUser(body);
	res.status(200).send({
		...user,
		token
	});
};

const updateUser = async (
	{
		body,
		params,
		jwt,
		mangodb: {
			rec: { id }
		}
	},
	res
) => {
	const { email } = body;
	const tokenPayload = {
		jti: JWT_JTI,
		secret: JWT_SECRET,
		email
	};
	const token = await security.getSignedToken(tokenPayload);
	await usersService.updateUser(id, body);
	res.status(200).send({
		token
	});
};

const deleteUser = async (
	{
		body,
		params,
		jwt,
		mangodb: {
			rec: { id }
		}
	},
	res
) => {
	const success = await usersService.deleteUser(id);
	res.status(success ? 200 : 400).end();
};

module.exports = {
	// getUsers,
	getSingleUserByEmail,
	addEmailGetValidation,
	addEmailPostValidation,
	addUser,
	updateUser,
	deleteUser
};
