const http = require('http');
require('dotenv').config();

const app = require('./app');
const { PORT } = require('./utils/config');

const server = http.createServer(app);

const port = PORT || 5000;

server.listen(port);
