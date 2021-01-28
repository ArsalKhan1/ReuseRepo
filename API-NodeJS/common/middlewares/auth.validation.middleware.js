const jwt = require('jsonwebtoken');
const secret = require('../config/env.config.js').jwt_secret;
const crypto = require('crypto');

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = Buffer.from(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(400).send({error: 'Invalid refresh token'});
    }
};

/**
 * Check if the request came with a valid auth token
 *
 * @param {Object} req - the http request
 * @param {Object} res - the http response
 * @param {Function} next - a callback to the next function to be run
 * @returns {Object} an http response if theres an error, the return value of the next callback otherwise
 */
exports.requireValidJWT = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], secret);
                return next();
            }

        } catch (err) {
            return res.status(403).send({errors: "Invalid JWT token"});
        }
    } else {
        return res.status(401).send({errors: "Missing JWT token"});
    }
};