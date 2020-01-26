'use strict';

let homeDir = require('homedir');

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 9000,

    // MongoDB connection options
    mongo: {
        uri: 'mongodb://saffronAdmin:VICKYv78@202.71.13.239:27017/saffron?authSource=admin'
    },

    logFile: {
        filePath: homeDir() + '/Saffron'
    }

};
//# sourceMappingURL=production.js.map
