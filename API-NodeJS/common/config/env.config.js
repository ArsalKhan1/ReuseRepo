/**
 * Global variables used by the API
 */

module.exports = {
    "port": 3600,
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "ADMIN": 2
    },
    "dbConn":"mongodb://reuseideas:bE3w9RvZAP40YQHU396BmGC0M4A1iIheiNfh0Gizfp0zcTegLsANsZPpXOc3z1AEDRSq11EIq5mox4SkEsHiCQ==@reuseideas.mongo.cosmos.azure.com:10255/?ssl=true&appName=@reuseideas@"
};
