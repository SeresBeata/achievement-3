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
        //Create new var and set to an empty string
        filePath = '';

    //Determine if the URL contains the word “documentation”
    if (q.pathname.includes('documentation')) {
        //If it contains: change the `filePath` for documentation.html - to return the “documentation.html” file to the user;
        filePath = __dirname + '/documentation.html';
    } else {
        //If it doesn't contain: change the `filePath` for index.html - to return the “index.html” file to the user;
        filePath = 'index.html';
    }
});

//Listens for requests on port
server.listen(port, () => {
    console.log(`Server running at ${port} port.`);
});
