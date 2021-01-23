/** This is mainly used for creating connection with Azure Cosmos DB */

const mongoose = require('mongoose');
const config = require('../config/env.config');
let count = 0;

mongoose.set('useFindAndModify', false);

const options = {
    dbName: 'ReuseRepo',
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false

};

//AK - the retry is built into the lib, we just need to use it right so that even when it disconnect, it connect back automatically. 
// we should not be retrying it behind timeout.
const connectWithRetry = () => {
    var isInTest = typeof global.it === 'function'; // True if Mocha is running a test
    mongoose.connect(config.dbConn, options)
    .then(() => {
        if(!isInTest) { console.log('MongoDB is connected'); }
    });
};
connectWithRetry();

exports.mongoose = mongoose;
exports.options = options;
