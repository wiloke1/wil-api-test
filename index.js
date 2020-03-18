const http = require("http");
const initial = require("./handle");

const PORT = 4321;
const server = http.createServer();

server.listen(PORT, initial);
