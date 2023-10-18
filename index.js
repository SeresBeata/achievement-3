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

//Require auth.js, passport.js file, as well passport module
const setupLoginRoute = require('./auth');
setupLoginRoute(app); //Use 'app' argument to ensure that Express is available in auth.js file as well.
const passport = require('passport');
require('./passport');

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
    .get(passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get(
    '/movies/:title',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
);

//Create Express GET route located at the endpoint “/movies/moviesbygenres/:genreName”. Return movies by genre.
app.get(
    '/movies/moviesbygenres/:genreName',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
);

//Create Express GET route located at the endpoint “/movies/genres/:genreName”. Return data about a genre by it's name.
app.get(
    '/movies/genres/:genreName',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
);

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
app.get('/movies/directors/:directorName', async (req, res) => {
    async function findDirector() {
        const { directorName } = req.params;
        try {
            const findOneDirector = await Movie.findOne({
                'director.directorName': directorName,
            });

            if (findOneDirector != null) {
                res.status(200).json(findOneDirector.director);
            } else {
                //return message if director is not found
                res.status(400).send(
                    `Oh sorry...but there is no director with the name ${directorName}.`
                );
            }
        } catch (e) {
            return res.status(500).send(`error: ${e}`);
        }
    }

    findDirector();
});

//USER ROUTES --------------------------------------------------------------------------

//Create Express POST route located at the endpoint “/users”. Allow new users to register.
app.post('/users', async (req, res) => {
    async function createUser() {
        const { username, password, email, birthday, favouriteMovies } =
            req.body;

        const createNewUser = new User({
            username: username,
            password: password,
            email: email,
            birthday: birthday,
            favouriteMovies: favouriteMovies,
        });

        try {
            await createNewUser.save();
            res.status(201).json(createNewUser);
        } catch (e) {
            console.log(e);
            res.status(400).send(`error: ${e}`);
        }
    }
    createUser();
});

app.route('/users/:id')
    .get(getUserById, async (req, res) => {
        //Create Express GET route located at the endpoint “/users/:id”. Return data about a user by id.
        await res.userById.populate('favouriteMovies', 'title');
        res.json(res.userById);
    })
    .put(getUserById, async (req, res) => {
        // Create Express PUT route located at the endpoint “/users/:id”. Allow users to update their data.
        async function updateUser() {
            const { username, password, email, birthday } = req.body;
            const { id } = req.params;
            try {
                const updateUserById = await User.findByIdAndUpdate(id, {
                    $set: {
                        username: username,
                        password: password,
                        email: email,
                        birthday: birthday,
                    },
                });
                if (updateUserById != null) {
                    const findUpdatedUser = await User.findById(id);
                    await findUpdatedUser.populate('favouriteMovies', 'title');
                    res.status(200).json(findUpdatedUser);
                }
            } catch (e) {
                return res.status(500).send(`error: ${e}`);
            }
        }
        updateUser();
    })
    .delete(getUserById, async (req, res) => {
        //Create Express DELETE route located at the endpoint “/users/:id”. Allow users to deregister.
        const { id } = req.params;
        try {
            await User.findByIdAndRemove(id);
            res.status(200).send(`User ${id} was deleted`);
        } catch (e) {
            return res.status(500).send(`error: ${e}`);
        }
    });

app.route('/users/:id/:movieId')
    .post(getUserById, async (req, res) => {
        //Create Express POST route located at the endpoint “/users/:id/:movieId”. Allow users to add a movie to favouriteMovies
        async function addFavMovie() {
            const { id, movieId } = req.params;
            try {
                const findTheMovie = await Movie.findById(movieId);

                if (findTheMovie != null) {
                    const updateUserById = await User.findByIdAndUpdate(id, {
                        $addToSet: {
                            favouriteMovies: movieId,
                        },
                    });
                    if (updateUserById != null) {
                        const findUpdatedUser = await User.findById(id);
                        await findUpdatedUser.populate(
                            'favouriteMovies',
                            'title'
                        );
                        res.status(200).json(findUpdatedUser);
                    }
                } else {
                    res.status(400).send(
                        `Oh sorry...but there is no movie with the id ${id}.`
                    );
                }
            } catch (e) {
                return res.status(500).send(`error: ${e}`);
            }
        }
        addFavMovie();
    })
    .delete(getUserById, async (req, res) => {
        //Create Express DELETE route located at the endpoint “/users/:id/:movieId”. Allow users to delete a movie from favoriteMovies
        async function delFavMovie() {
            const { id, movieId } = req.params;
            try {
                const findTheMovie = await Movie.findById(movieId);

                if (findTheMovie != null) {
                    const updateUserById = await User.findByIdAndUpdate(id, {
                        $pull: {
                            favouriteMovies: movieId,
                        },
                    });
                    if (updateUserById != null) {
                        const findUpdatedUser = await User.findById(id);
                        await findUpdatedUser.populate(
                            'favouriteMovies',
                            'title'
                        );
                        res.status(200).json(findUpdatedUser);
                    }
                } else {
                    res.status(400).send(
                        `Oh sorry...but there is no movie with the id ${id}.`
                    );
                }
            } catch (e) {
                return res.status(500).send(`error: ${e}`);
            }
        }
        delFavMovie();
    });

//Create middleware to find User by id
async function getUserById(req, res, next) {
    let userById;
    try {
        userById = await User.findById(req.params.id);
        if (userById == null) {
            return res
                .status(404)
                .send(`Cannot find user with this id ${req.params.id}.`);
        }
    } catch (e) {
        return res.status(500).send(`error: ${e}`);
    }

    res.userById = userById;
    next();
}

//Create error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Listen for requests on port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
