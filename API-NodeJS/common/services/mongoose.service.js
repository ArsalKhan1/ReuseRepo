/** 
 * This is mainly used for creating connection with Azure Cosmos/mongo DB 
 * */

const mongoose = require('mongoose');
const config = require('../config/env.config');


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


/**
 * Connects to Mongo / cosmos db  
 * Reads the connection string from config and connects with mongo / cosmos db.
 * re-connects if connection is broken
 */
let count = 0;
const connectWithRetry = () => {
    var isInTest = typeof global.it === 'function'; // True if Mocha is running a test
    mongoose.connect(config.dbConn, options)
        .then(() => {
            if (!isInTest) { console.log('MongoDB is connected'); }
        }).catch(err => {
            console.log('MongoDB connection unsuccessful, retry after 2 seconds. ', ++count);
            setTimeout(connectWithRetry, 2000)
        })
};
connectWithRetry();

exports.mongoose = mongoose;
exports.options = options;
