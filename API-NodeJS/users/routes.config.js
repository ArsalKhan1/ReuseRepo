const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const NORMAL = config.permissionLevels.NORMAL_USER;

/**
* Config routes for the user API
* @param {Object} app the express app
*/
exports.routesConfig = function (app) {
    app.post('/users/register', [
        UsersController.register
    ]);
    app.get('/users/:userId', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requirePermissionLevel(NORMAL),
        PermissionMiddleware.requireSameUser,
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requirePermissionLevel(NORMAL),
        PermissionMiddleware.requireSameUser,
        UsersController.patchById
    ]);
    app.delete('/users/:userId', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requirePermissionLevel(ADMIN),
        UsersController.removeById
    ]);
    app.post('/users/items/insert', [
        ValidationMiddleware.requireValidJWT,
        UsersController.addItem
    ]);
    app.delete('/users/items/delete/:itemId', [
        ValidationMiddleware.requireValidJWT,
        UsersController.removeItem
    ]);
    app.get('/users/:userId/items', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requireSameUser,
        UsersController.getItems
    ]);
};
