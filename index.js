//Require Express
const express = require('express'),
    morgan = require('morgan'), //Require Morgan
    fs = require('fs'), // Require Node module fs
    path = require('path'), // Require Node module path
    bodyParser = require('body-parser'), //Require body-parser
    mongoose = require('mongoose'), //Require Mongoose
    uuid = require('uuid'); //Require UUID
//Require models
const { Movie, User } = require('./models/models');
//Declare variable that encapsulates Express’s functionality
const app = express();
//Server Port
const port = 3000;

// Create a writable stream (in append mode) for writing log data in "log.txt"file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a',
});

// Use logging middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

//Use express.static() to serve “documentation.html” from public folder
app.use('/documentations', express.static(path.join(__dirname, 'public')));

//Use body-parser middleware to parse incoming request bodies. Parse JSON and URL-encoded data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Require dotenv
require('dotenv').config();

//Connect to DB - use dotenv to not expose data
mongoose.connect(process.env.CONNECTION_URI);

//Create Express GET route located at the endpoint “/”
app.get('/', (req, res) => {
    //return textual response
    res.send('Welcome to my Movie App!');
    //Confirm, if dotenv module works properly
    // console.log('CONNCECTION_URI: ' + process.env.CONNECTION_URI);
});

//MOVIE ROUTES --------------------------------------------------------------------------

app.route('/movies')
    .get(async (req, res) => {
        //Create Express GET route located at the endpoint “/movies”. Return a list of ALL movies.
        async function getAllMovies() {
            try {
                const findAllMovies = await Movie.find();
                res.status(200).json(findAllMovies);
            } catch (e) {
                res.status(500).send(`error: ${e}`);
            }
        }
        getAllMovies();
    })
    .post(async (req, res) => {
        //Create Express POST route located at the endpoint “/movies”. Create a movie.
        async function createMovie() {
            const {
                title,
                description,
                genre,
                releaseDate,
                director,
                imagePath,
                featured,
            } = req.body;

            const newMovie = new Movie({
                title: title,
                description: description,
                genre: {
                    genreName: genre.genreName,
                    genreDescription: genre.genreDescription,
                },
                releaseDate: releaseDate,
                director: {
                    directorName: director.directorName,
                    bio: director.bio,
                    birth: director.birth,
                    death: director.death,
                },
                imagePath: imagePath,
                featured: featured,
            });
            try {
                await newMovie.save();
                res.status(201).json(newMovie);
            } catch (e) {
                console.log(e);
                res.status(400).send(`error: ${e}`);
            }
        }
        createMovie();
    });

//Create Express GET route located at the endpoint “/movies/:title”. Return a single movie by title.
app.get('/movies/:title', async (req, res) => {
    async function getOneMove() {
        const { title } = req.params;
        try {
            const findOneMovie = await Movie.findOne({ title: title });
            if (findOneMovie != null) {
                res.status(200).json(findOneMovie);
            } else {
                //return message if movie is not found
                res.status(400).send(
                    `Oh sorry...but there is no movie with the title ${title}.`
                );
            }
        } catch (err) {
            return res.status(500).send(`error: ${e}`);
        }
    }
    getOneMove();
});

//Create Express GET route located at the endpoint “/movies/moviesbygenres/:genreName”. Return movies by genre.
app.get('/movies/moviesbygenres/:genreName', async (req, res) => {
    async function getMoviesByGenre() {
        const { genreName } = req.params;
        try {
            const findGenre = await Movie.findOne({
                'genre.genreName': genreName,
            });

            if (findGenre != null) {
                const findMovieByGenre = await Movie.find({
                    'genre.genreName': genreName,
                });
                if (findMovieByGenre != null) {
                    res.status(200).json(findMovieByGenre);
                }
            } else {
                //return message if movie is not found
                res.status(400).send(
                    `Oh sorry...but there is no movie with the genre ${genreName}.`
                );
            }
        } catch (e) {
            return res.status(500).send(`error: ${e}`);
        }
    }
    getMoviesByGenre();
});

//Create Express GET route located at the endpoint “/movies/genres/:genreName”. Return data about a genre by it's name.
app.get('/movies/genres/:genreName', async (req, res) => {
    async function genreInMovies() {
        const { genreName } = req.params;
        try {
            const findGenre = await Movie.findOne({
                'genre.genreName': genreName,
            });

            if (findGenre != null) {
                res.status(200).json(findGenre.genre);
            } else {
                //return message if genre is not found
                res.status(400).send(
                    `Oh sorry...but there is no genre with the name ${genreName}.`
                );
            }
        } catch (e) {
            return res.status(500).send(`error: ${e}`);
        }
    }
    genreInMovies();
});

//Create Express GET route located at the endpoint “/movies/moviesbydirector/:directorName”. Return movies by director.
app.get('/movies/moviesbydirectors/:directorName', async (req, res) => {
    async function getMoviesByDirector() {
        const { directorName } = req.params;
        try {
            const movieByDirector = await Movie.findOne({
                'director.directorName': directorName,
            });

            if (movieByDirector != null) {
                const findMovieByDir = await Movie.find({
                    'director.directorName': directorName,
                });
                if (findMovieByDir != null) {
                    res.status(200).json(findMovieByDir);
                }
            } else {
                //return message if movie is not found
                res.status(400).send(
                    `Oh sorry...but there is no movie with the director ${directorName}.`
                );
            }
        } catch (e) {
            return res.status(500).send(`error: ${e}`);
        }
    }
    getMoviesByDirector();
});

//Create Express GET route located at the endpoint “/movies/directors/:directorName”. Return data about a director by name.
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params; //obj destructuring
    //find a director by name
    let directorInMovies = movies.find((movie) => {
        return movie.director.name === directorName;
    });
    if (directorInMovies) {
        //return the data if director is found
        let director = directorInMovies.director;
        res.status(200).json(director);
    } else {
        //return message if director is not found
        res.status(400).send(
            `Oh sorry...but there is no director with the name ${directorName}.`
        );
    }
});

//Create Express POST route located at the endpoint “/users”. Allow new users to register.
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Create Express PUT route located at the endpoint “/users/:id”. Allow users to update username.
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;

    let user = users.find((user) => {
        return user.id.toString() === id;
    });

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send(`There is no such user with id: ${id}.`);
    }
});

//Create Express POST route located at the endpoint “/users/:id/:movieTitle”. Allow users to add a movie to favouriteMovies
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => {
        return user.id.toString() === id;
    });

    if (user) {
        user.favouriteMovies.push(movieTitle);
        // res.status(200).json(user);
        res.status(200).send(
            `${movieTitle} has been added to user id ${id}'s array.`
        );
    } else {
        res.status(400).send(`There is no such user with id: ${id}.`);
    }
});

//Create Express DELETE route located at the endpoint “/users/:id/:movieTitle”. Allow users to delete a movie from favoriteMovies
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => {
        return user.id.toString() === id;
    });

    if (user) {
        user.favouriteMovies = user.favouriteMovies.filter((title) => {
            return title !== movieTitle;
        });
        // res.status(200).json(user);
        res.status(200).send(
            `${movieTitle} has been removed from user id ${id}'s array.`
        );
    } else {
        res.status(400).send(`There is no such user with id: ${id}.`);
    }
});

//Create Express DELETE route located at the endpoint “/users/:id”. Allow users to deregister.
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find((user) => {
        return user.id.toString() === id;
    });

    if (user) {
        users = users.filter((user) => {
            return user.id.toString() !== id;
        });
        // res.status(200).json(users);
        res.status(200).send(`User with id ${id} has been deregistered.`);
    } else {
        res.status(400).send(`There is no such user with id: ${id}.`);
    }
});

//Create error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Listen for requests on port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
