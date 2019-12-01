const http = require('http');
const axios = require('axios');
const initial = require('./handle');
const configure = require('../../wiloke.test.api.json');

const PORT = 4321;
const server = http.createServer();

axios.defaults.baseURL = configure.baseUrl;

server.listen(PORT, initial);
