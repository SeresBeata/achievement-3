require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('./models/models');
const passportJWT = require('passport-jwt');

let Users = models.User;
let JWTSrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;
