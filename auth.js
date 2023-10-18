require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Local passport.js file
