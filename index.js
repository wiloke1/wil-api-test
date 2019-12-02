const http = require("http");
const axios = require("axios");
const initial = require("./handle");
const configure = require("../../wiloke.test.api.json");

const PORT = 4321;
const server = http.createServer();

Object.keys(configure.axiosDefaults).forEach(key => {
  axios.defaults[key] = configure.axiosDefaults[key];
});

server.listen(PORT, initial);
