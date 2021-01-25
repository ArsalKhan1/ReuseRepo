const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const NORMAL = config.permissionLevels.NORMAL_USER;

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
    app.post('/user/items/insert', [
        ValidationMiddleware.requireValidJWT,
        UsersController.addItem
    ]);
    app.delete('/user/items/delete', [
        ValidationMiddleware.requireValidJWT,
        UsersController.removeItem
    ]);
    app.get('/user/:userId/items', [
        ValidationMiddleware.requireValidJWT,
        PermissionMiddleware.requireSameUser,
        UsersController.getItems
    ]);
};
