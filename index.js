//Require Express
const express = require('express'),
    morgan = require('morgan'), //Require Morgan
    fs = require('fs'), // Require Node module fs
    path = require('path'); // Require Node module path
//Declare variable that encapsulates Express’s functionality
const app = express();
//Server Port
const port = 3000;
