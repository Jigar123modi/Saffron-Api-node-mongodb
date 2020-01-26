let homeDir = require('homedir');

// Test specific configuration
// ===========================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://saffronAdmin:VICKYv78@202.71.13.239:27017/saffron?authSource=admin'
    },

    logFile: {
        filePath: homeDir() + '/Saffron'
    },

    port: '9000',
};
