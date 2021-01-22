/** Article Router Config
 * This file containes route for search, fetch, add, update & delete the articles  
 * */

const ArticleController = require('./controllers/article.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

/**
 * Congig routes for Search, Create, Update, Find and Delete APIs
 * @param {express} the express app 
 */
exports.routesConfig = function (app) {
    /** Search article basedon author and / or tags */
    // Post is used to get the params from body
    app.post('/article/search', [
        ArticleController.search
    ]);

    /** Create Article API */
    app.post('/article/create', [
        ValidationMiddleware.requireValidJWT,
        ArticleController.createArticle
    ]);

    /** Update Article */
    app.put('/article/update/:articleId', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requireSameAuthor,
        ArticleController.updateArticle
    ]);

    /** Delete Article By Id */
    app.delete('/article/:articleId', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requireSameAuthor,
        ArticleController.removeById
    ]);

    /** Fetch Article By Id */
    app.get('/article/:id', [
        ArticleController.getArticleById
    ]);
};
