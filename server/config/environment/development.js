let homeDir = require('homedir');

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://saffronAdmin:VICKYv78@202.71.13.239:27017/saffron?authSource=admin'
    },

    logFile: {
        filePath: homeDir() + '/Saffron'
    },

    // Seed database on startup
    seedDB: true
};
