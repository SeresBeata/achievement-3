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

// Use logging middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

//Create array
let topMovies = [
    {
        title: 'Anna and the King',
        year: '1999',
    },
    {
        title: 'Matrix',
        year: '1999',
    },
    {
        title: 'Back to the Future',
        year: '1985',
    },
    {
        title: 'Memoirs of a Geisha',
        year: '2005',
    },
    {
        title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
        year: '2003',
    },
    {
        title: 'Inception',
        year: '2010',
    },
    {
        title: 'Jurassic Park',
        year: '1993',
    },
    {
        title: 'The Dark Knight',
        year: '2008',
    },
    {
        title: 'Star Wars: Return of the Jedi',
        year: '1983',
    },
    {
        title: 'The Intouchables',
        year: '2011',
    },
];

//Create Express GET route located at the endpoint “/”
app.get('/', (req, res) => {
    //return textual response
    res.send('Welcome to my Movie App!');
});
