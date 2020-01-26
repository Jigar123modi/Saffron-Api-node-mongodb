/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';

mongoose.Promise = require('bluebird');
import config from './config/environment';
import Log from './config/Log';
import '../server/api/CronJob/index';

import http from 'http';
import cors from 'cors';

import expressConfig from './config/express';
import registerRoutes from './routes';
import seedDatabaseIfNeeded from './config/seed';
import {socketOpen} from '../server/api/Socket';
import {AddFirstOrder} from './api/CronJob/index';

//const http2 = require('http2');
let https = require('https');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
let moment = require('moment-timezone');

//todo Swagger
//const swaggerDocument = require('./swagger.json');


mongoose.connect(config.mongo.uri, {useMongoClient: true});
mongoose.connection.on('error', function (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1); // eslint-disable-line no-process-exit
});

seedDatabaseIfNeeded();

// Setup server
let app = express();
console.log(__dirname);
app.use(cors());
app.use('/images', express.static(__dirname + '/images'));

//todo Swagger
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//var privateKey = fs.readFileSync('server-key.pem').toString();
//var certificate = fs.readFileSync('server-crt.pem').toString();
//var ca = fs.readFileSync('ca-crt.pem').toString();
/*var credentials = {
    key: privateKey, cert: certificate,
    requestCert: false,
    rejectUnauthorized: true
};*/

//let server = https.createServer(credentials, app);
let server = http.createServer(app);

socketOpen(server);
console.log("socket connection successfully created");
expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {

    new Log();
    Log.logInit();

    app.angularFullstack = server.listen(config.port, config.ip, async function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
        Log.writeLog(Log.eLogLevel.info, 'Express server listening on ' + config.port + ', in ' + app.get('env') + ' mode');
        let currentTime = moment.tz('Asia/Kolkata').format();
        let currentDate = new Date(currentTime);
        await AddFirstOrder(currentDate);
    });
}


setImmediate(startServer);

// Expose app
exports = module.exports = app;
