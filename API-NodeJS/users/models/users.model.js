const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

/** User model schema */
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    permission: Number,
    items: [{
        name: String,
        tags: [{
            type: String
        }]
    }]
});


/**
 * Converts type of @field _id of ObjectId to hex string and returns as a new virtual field @field 'id'
 * 
 * @param {any} id the user id
 * @returns {string} the hex string
 */
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Ensure virtual fields are serialzied
 */
userSchema.set('toJSON', {
    virtuals: true
});

/**
 * Finds user by id
 * 
 * @param {any} cb the callback function for after the search
 * @returns {user} the user object
 */
userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const User = mongoose.model('Users', userSchema);

/**
 * Finds a user based on email address
 * 
 * @param {string} email the email address to search for
 * @returns {Promise} a promise that executes the search
 */
exports.findByEmail = (email) => {
    return User.find({email: email});
};

/**
 * Finds a user based on username
 * 
 * @param {string} username the username to search for
 * @returns {Promise} a promise that executes the search
 */
exports.findByUsername = (username) => {
    return User.find({username: username});
};

/**
 * Finds a user based on ID
 * 
 * @param {string} id the ID to search for
 * @returns {User} the user with a matching ID
 */
exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            if(result == null) {
                return null;
            }
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            delete result.salt;
            delete result.hash;
            return result;
        });
};

/**
 * Add a new user to the database
 * 
 * @param {Object} userData the data for a new user
 * @returns {Promise} a promise for the completion of the database insertion
 */
exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

/**
 * Update user data (username, email, password)
 * 
 * @param {String} id the idea of the user to update
 * @param {Object} userData the updated user data
 * @returns {Promise} a promise that performs the update
 */
exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData,
    {new: true});
};

/**
 * Get a promise to remove the a user from the database with a given ID 
 * 
 * @param {String} userId the ID to search for
 * @returns {Promise} a promise that performs the deletion
 */
exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

