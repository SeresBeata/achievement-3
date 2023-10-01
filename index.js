//Require Express
const express = require('express'),
    morgan = require('morgan'), //Require Morgan
    fs = require('fs'), // Require Node module fs
    path = require('path'), // Require Node module path
    bodyParser = require('body-parser'), //Require body-parser
    uuid = require('uuid'); //Require UUID
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
app.use('/documentation', express.static(path.join(__dirname, 'public')));

//Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

//Create array for users
let users = [
    {
        id: 1,
        name: 'Kim',
        favouriteMovies: [],
    },
    {
        id: 2,
        name: 'Joe',
        favouriteMovies: ['Back to the Future'],
    },
];

//Create array for movies
let movies = [
    {
        title: 'Anna and the King',
        year: '1999',
        description:
            "The story concerns Anna Leonowens, an English school teacher in Siam during the late 19th century, who becomes the teacher of King Mongkut's many children and wives.",
        genre: {
            name: 'period drama',
            description:
                'A film production set in a particular historical period and characterized by the use of costumes, sets, and props that are typical or evocative of the era.',
        },
        director: {
            name: 'Andy Tennant',
            bio: ' An American screenwriter, film and television director, actor, and dancer.',
            born: '1955',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Anna_and_the_king.jpg',
    },
    {
        title: 'Matrix',
        year: '1999',
        description:
            'The film depicts a dystopian future in which humanity is unknowingly trapped inside the Matrix, a simulated reality that intelligent machines have created to distract humans while using their bodies as an energy source.',
        genre: {
            name: 'science fiction',
            description:
                'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena.',
        },
        director: {
            name: 'The Wachowski Siblings',
            bio: ' American film and television directors, writers and producers.',
            born: '1965 and 1967',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg',
    },
    {
        title: 'Back to the Future',
        year: '1985',
        description:
            'Set in 1985, it follows Marty McFly, a teenager accidentally sent back to 1955 in a time-traveling DeLorean automobile built by his eccentric scientist friend Emmett "Doc" Brown.',
        genre: {
            name: 'science fiction',
            description:
                'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena.',
        },
        director: {
            name: 'Robert Zemeckis',
            bio: ' An American film and television director, writer and producer.',
            born: '1952',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg',
    },
    {
        title: 'Memoirs of a Geisha',
        year: '2005',
        description:
            'It tells the story of a young Japanese girl, Chiyo Sakamoto, who is sold by her impoverished family to a geisha house.',
        genre: {
            name: 'period drama',
            description:
                'A film production set in a particular historical period and characterized by the use of costumes, sets, and props that are typical or evocative of the era.',
        },
        director: {
            name: 'Rob Marshall',
            bio: ' An American film and theater director, producer, and choreographer.',
            born: '1960',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/0/09/Memoirs_of_a_Geisha_Poster.jpg',
    },
    {
        title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
        year: '2003',
        description:
            'The story follows pirate Captain Jack Sparrow and blacksmith Will Turner, as they rescue the kidnapped Elizabeth Swann from the crew of the Black Pearl.',
        genre: {
            name: 'fantasy',
            description:
                'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology or folklore.',
        },
        director: {
            name: 'Gore Verbinski',
            bio: ' An American film director, screenwriter, producer, and musician.',
            born: '1964',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/8/89/Pirates_of_the_Caribbean_-_The_Curse_of_the_Black_Pearl.png',
    },
    {
        title: 'Inception',
        year: '2010',
        description:
            'The film is about a professional thief who steals information by infiltrating the subconscious of his targets.',
        genre: {
            name: 'science fiction',
            description:
                'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena.',
        },
        director: {
            name: 'Christopher Nolan',
            bio: ' A British and American film and television director, writer and producer.',
            born: '1970',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
    },
    {
        title: 'Jurassic Park',
        year: '1993',
        description:
            'The film is centered on a disastrous attempt to create a theme park of cloned dinosaurs.',
        genre: {
            name: 'science fiction',
            description:
                'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena.',
        },
        director: {
            name: 'Steven Spielberg',
            bio: ' An American film and television director, writer and producer.',
            born: '1946',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg',
    },
    {
        title: 'The Dark Knight',
        year: '2008',
        description:
            'The plot follows the vigilante Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City.',
        genre: {
            name: 'superhero film',
            description:
                'Superhero films focus on superheroes, who possess superhuman abilities and are dedicated to protecting the public.',
        },
        director: {
            name: 'Christopher Nolan',
            bio: ' A British and American film and television director, writer and producer.',
            born: '1970',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
    },
    {
        title: 'Star Wars: Return of the Jedi',
        year: '1983',
        description:
            'Set one year after The Empire Strikes Back, the Galactic Empire is constructing a second Death Star. Rebel Luke Skywalker, struggles to bring his father,  back to the light side of the Force.',
        genre: {
            name: 'science fiction',
            description:
                'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena.',
        },
        director: {
            name: 'George Lucas',
            bio: ' An American film and television director, writer and producer.',
            born: '1944',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/b/b2/ReturnOfTheJediPoster1983.jpg',
    },
    {
        title: 'The Intouchables',
        year: '2011',
        description:
            'After the aristocratic and intellectual Philippe becomes a quadriplegic from a paragliding accident, hires a young man from the projects to be his caretaker.',
        genre: {
            name: 'comedy drama',
            description:
                'Comedy drama, also known as the portmanteau dramedy, is a genre of dramatic works that combines elements of comedy and drama.',
        },
        director: {
            name: 'Éric Toledano and Olivier Nakache',
            bio: ' French film and television directors, writers and producers.',
            born: '1971 and 1973',
            death: '',
        },
        img: 'https://upload.wikimedia.org/wikipedia/en/9/93/The_Intouchables.jpg',
    },
];

//Create Express GET route located at the endpoint “/”
app.get('/', (req, res) => {
    //return textual response
    res.send('Welcome to my Movie App!');
});

//Create Express GET route located at the endpoint “/movies”. Return a list of ALL movies.
app.get('/movies', (req, res) => {
    //return status code and JSON obj
    res.status(200).json(movies);
});

//Create Express GET route located at the endpoint “/movies/:title”. Return a single movie by title.
app.get('/movies/:title', (req, res) => {
    const { title } = req.params; //obj destructuring
    //find a movie by title
    let movie = movies.find((movie) => {
        return movie.title === title;
    });
    if (movie) {
        //return the movie if it is found
        res.status(200).json(movie);
    } else {
        //return message if movie is not found
        res.status(400).send(
            `Oh sorry...but there is no movie with the title ${title}.`
        );
    }
});

//Create Express GET route located at the endpoint “/movies/genres/:genreName”. Return data about a genre by it's name.
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params; //obj destructuring
    //find a genre by name
    let genreInMovies = movies.find((movie) => {
        return movie.genre.name === genreName;
    });
    if (genreInMovies) {
        //return the data if genre is found
        let genre = genreInMovies.genre;
        res.status(200).json(genre);
    } else {
        //return message if genre is not found
        res.status(400).send(
            `Oh sorry...but there is no genre with the name ${genreName}.`
        );
    }
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

//Create error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Listen for requests on port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
