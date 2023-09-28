//Require Express
const express = require('express'),
    morgan = require('morgan'), //Require Morgan
    fs = require('fs'), // Require Node module fs
    path = require('path'); // Require Node module path
//Declare variable that encapsulates Express’s functionality
const app = express();
//Server Port
const port = 3000;

// Create a writable stream (in append mode) for writing log data in "log.txt"file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

//Use express.static() to serve “documentation.html” from public folder
app.use('/documentation', express.static(path.join(__dirname, 'public')));
