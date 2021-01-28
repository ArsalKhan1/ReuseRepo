const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

/**
 * Checks if the required th authorization fields are in the http request
 * 
 * @param {Object} req the http request
 * @param {Object} res the https response object
 * @param {Function} next the callback function used to chain to the next opertaion
 */
exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

/**
 * Validates the authorization fields in the http request
 *
 * @param {Object} req the http request
 * @param {Object} res the https response object
 * @param {Function} next the callback function used to chain to the next opertaion
 */
exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }else{
                let salt = user[0].salt;
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === user[0].hash) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        username: user[0].username,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                        permission: user[0].permission
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid email or password']});
                }
            }
        });
};