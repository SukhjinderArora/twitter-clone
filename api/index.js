const http = require('http');
require('dotenv').config();

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port);
