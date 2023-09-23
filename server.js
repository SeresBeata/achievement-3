//Require http module
const http = require('node:http');
//Require url module
const url = require('node:url');
//Require fs module
const fs = require('node:fs');
//Server port
const port = 8080;

//Create server
const server = http.createServer((req, res) => {
});

//Listens for requests on port
server.listen(port, () => {
    console.log(`Server running at ${port} port.`);
});
