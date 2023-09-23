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
    //Declare new var `addr` and assign to `request.url` to get the URL from the request
    let addr = req.url,
        //parse the request.url
        q = url.parse(addr, true),
});

//Listens for requests on port
server.listen(port, () => {
    console.log(`Server running at ${port} port.`);
});
