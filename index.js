const http = require("http");
const axios = require("axios");
const initial = require("./handle");
const configure = require("../../wiloke.test.api.json");

const PORT = 4321;
const server = http.createServer();
const program = new commander.Command();

Object.keys(configure.axiosDefaults).forEach(key => {
  axios.defaults[key] = configure.axiosDefaults[key];
});

process.stdin.resume();
process.stdin.on("end", () => server.listen(PORT, initial));
