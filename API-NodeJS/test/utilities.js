/**
 * Generate a random string for testing purposes
 * 
 * @param {int} length the length of the string to generate
 */
function randomString(length) {
    let random = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        random += characters.charAt(Math.floor(Math.random() * 26));
    }
    return random;
}

/**
 * Generate a random email address for testing purposes
 * 
 * @param {int} length the length of the email to generate (not including the domain)
 */
function randomEmail(length) {
    return randomString(length) + "@gmail.com"
}

exports.randomString = (length) => randomString(length);

exports.randomEmail = (length) => randomEmail(length);

// A user filled with randomly generated data to be used by tests
exports.testUser = {
    firstName: randomString(7),
    lastName: randomString(7),
    username: randomString(10),
    email: randomEmail(10),
    password: randomString(10),
    permission: 2 // This user is an admin so they can delete themselves
}