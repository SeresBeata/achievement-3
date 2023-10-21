require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Local passport.js file

//Generate the token
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, // The username, that is encoded in the JWT
        expiresIn: '7d', // The token expire in 7 days
        algorithm: 'HS256', // The algorithm used to “sign” or encode the values of the JWT
    });
};

//Create “/login” endpoint for registered users
module.exports = (router) => {
    router.post('/login', (req, res) => {
        console.log('called');
        passport.authenticate(
            'local',
            { session: false },
            (error, user, info) => {
                if (error || !user) {
                    return res.status(400).json({
                        message: 'Something is not right',
                        user: user,
                        // error: error,
                        // user: user,
                        // info: info.message,
                    });
                }
                req.login(user, { session: false }, (error) => {
                    if (error) {
                        res.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.json({ user, token }); //returns the token. Shorthand for res.json({ user: user, token: token })
                });
            }
        )(req, res);
    });
};
