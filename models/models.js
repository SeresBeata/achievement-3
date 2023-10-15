//Require Mongoose
const mongoose = require('mongoose');

//Create schemas
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [
            true,
            'Why no title? Please check your data entry, no title specified!',
        ],
    },
    description: String,
    genre: {
        genreName: String,
        genreDescription: String,
    },
    releaseDate: Date,
    director: {
        directorName: String,
        bio: String,
        birth: Date,
        death: Date,
    },
    imagePath: String,
    featured: Boolean,
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [
            true,
            'Why no name? Please check your data entry, no name specified!',
        ],
    },
    password: {
        type: String,
        required: [
            true,
            'Why no password? Please check your data entry, no password specified!',
        ],
    },
    email: {
        type: String,
        required: [
            true,
            'Why no email? Please check your data entry, no email specified!',
        ],
    },
    birthday: Date,
    favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});
