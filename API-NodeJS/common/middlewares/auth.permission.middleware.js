const ADMIN_PERMISSION = require('../config/env.config').permissionLevels.ADMIN;
const ArticleModel = require('../../article/models/article.model');

/**
 * Check that the user has a certain level of permission before continuing the request
 * 
 * @param {Number} requiredLevel the minimum required permission level
 * @returns {Object} an http response if theres an error, the return value of the next callback otherwise
 */
exports.requirePermissionLevel = (requiredLevel) => {
    return (req, res, next) => {
        let userPermission = parseInt(req.jwt.permission);
        if (userPermission >= requiredLevel) {
            return next();
        } else {
            return res.status(403).send({errors: "Not enough permissions"});
        }
    };
};

/**
 * Check that the request is pulling data from the same user
 * that made the request, or that the request came from an admin
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 * @param {Function} next a callback to the next function to be run
 * @returns {Object} an http response if error, the return value of the callback otherwise
 */
exports.requireSameUser = (req, res, next) => {
    let userPermission = parseInt(req.jwt.permission);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (userPermission >= ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({errors: "Not same user and not admin"});
        }
    }

};

/**
 * Check that the request on the article is coming from the author
 * or an admin
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 * @param {Function} next a callback to the next function to be run
 * @returns {Object} an http response if error, the return value of the callback otherwise
 */
exports.requireSameAuthor = async (req, res, next) => {
    // Let admins bypass
    let userPermission = parseInt(req.jwt.permission);
    if(userPermission >= ADMIN_PERMISSION) {
        return next();
    }

    // Check if the user logged in is the author of the article requested
    let username = req.jwt.username;
    let article = await ArticleModel.findById(req.params.articleId)
            .then((article) => {
                return article;
            });
    if(article.authorUsername === username) {
        return next();
    }
    else {
        return res.status(403).send({ errors: "Not same user and not admin" });
    }
}