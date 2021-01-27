const UserModel = require('../models/users.model');
const crypto = require('crypto');

/**
 * Insert a new user into the database (register them), but first check if their
 * email has been used before
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.register = (req, res) => {
    UserModel.findByEmail(req.body.email)
        .then((user) => {
            if (user[0]) {
                return res.status(406).send({error: "An account with this email already exists"});
            }
            checkUsernameThenRegister(req, res);
        });
    
};

/**
 * Check if the username has been used already before registering
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
function checkUsernameThenRegister(req, res) {
    UserModel.findByUsername(req.body.username)
        .then((user) => {
            if (user[0]) {
                return res.status(406).send({ error: "An account with this username already exists" });
            }
            registerRequest(req, res);
        });
}

/**
 * Make the query to register a user
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
function registerRequest(req, res) {    
    let salt = crypto.randomBytes(16).toString('base64');
    req.body.salt = salt;
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.hash = hash;
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        })
        .catch((err) => {
            res.status(406).send(err);
        });
}

/**
 * Search for a user based on ID
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            if(result == null) {
                res.status(404).send({ error: "User not found" });
                return;
            }
            res.status(200).send(result);
        });
};

/**
 * Update user data based on ID
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    // Disallow updating email and username to prevent duplicate conflicts
    delete req.body.email;
    delete req.body.username;

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

/**
 * Delete a user from the database based on ID
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};

/**
 * Check if there is another item with the same name but different tags
 * that already belongs to the user
 * 
 * @param {Object} items the items currently assosciated with the user
 * @param {Object} newItem the new item being added
 * @return {Boolean} whether an invalid duplicate exists 
 */
function checkInvalidDuplicateItems(items, newItem) {
    newItem.tags.sort();
    let newTags = JSON.stringify(newItem.tags);
    let returnVal = false;

    items.forEach(i => {
        if(i.name == newItem.name) {
            // Order of tags is irrelevant so sort before comparing
            i.tags.sort();

            if(JSON.stringify(i.tags) != newTags) {
                returnVal = true;
            }
        }
    });
    return returnVal;
}

/**
 * Add an item to a user's list
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.addItem = async (req, res) => {
    let user = await UserModel.findByUsername(req.jwt.username)
        .then((user) => {
            if(user[0]) {
                return user[0];
            }
            res.status(400).send({ errors: "User not found" });
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    
    if (res.statusCode == 400) {
        return;
    }

    if(!user.items) {
        user.items = [];
    }
    let newItem = {
        name: req.body.itemName,
        tags: req.body.tags
    }
    if(checkInvalidDuplicateItems(user.items, newItem)) {
        res.status(400).send({errors: "Cannot have 2 different items with the same name"});
        return;
    }
    user.items.push(newItem);

    UserModel.patchUser(req.jwt.userId, user)
        .then((result) => {
            res.status(200).send(result.items[result.items.length - 1]);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

/**
 * Delete an item from a user's list
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.removeItem = async (req, res) => {
    let user = await UserModel.findByUsername(req.jwt.username)
        .then((user) => {
            if (user[0]) {
                return user[0];
            }
            res.status(400).send({ errors: "User not found" });
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    
    if(res.statusCode == 400) {
        return;
    }
    if(!user.items) {
        res.status(400).send({errors: "This user has no items"});
        return;
    }
    let index = -1;
    for (let i = 0; i < user.items.length; i++) {
        if(user.items[i]._id == req.params.itemId) {
            index = i;
        }
    }
    if(index == -1) {
        res.status(400).send({errors: "Item not found"});
        return;
    }
    user.items.splice(index, 1);
    UserModel.patchUser(req.jwt.userId, user)
        .then((result) => {
            res.status(204).send(result);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

/**
 * Get all the items belonging to a user
 * 
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
exports.getItems = (req, res)  => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            if (result == null) {
                res.status(404).send({ error: "User not found" });
            }
            res.status(200).send(result.items);
        });
}