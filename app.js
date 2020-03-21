const http = require('http');
const app = require('express')();
const compression = require('compression');
const bodyParser = require('body-parser');
const winston = require('winston');
const { errors } = require('celebrate');

const mongo = require('./db/mongo');
// const authorization = require('./routes/middlewares/authorization');
const healthCheck = require('./routes/controllers/healthCheck');

const logger = require('./routes/middlewares/logger');
const routes = require('./routes/routes');

// //-- eth api
// const ethWeb3Api = require('./routes/middlewares/ethWeb3Api');
// const ethGasPricesApi = require('./routes/middlewares/ethGasPricesApi');

// Enable KeepAlive to speed up HTTP requests to another microservices
http.globalAgent.keepAlive = true;

const { PORT, NODE_ENV } = process.env;

app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/healthCheck', healthCheck.status);
// app.use(authorization);

// app.use(ethWeb3Api);
// app.use(ethGasPricesApi);

app.use('/v1', routes);
app.use(errors());
app.use(logger);

if (NODE_ENV !== 'test') {
	(async () => {
		await mongo.connectWithRetry();
		app.listen(PORT, () => {
			winston.info(`Server listening on http://localhost:${PORT}`);
		});
	})();
}

module.exports = app;
