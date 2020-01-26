'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('winston-daily-rotate-file');

let Log = class Log {

    // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    constructor() {
        console.log('Log Successfully Initialized');
    }

    static padRight(str, padString, length) {
        while (str.length < length) str = str + padString;
        return str;
    }

    /* Init stackify object and logger objects */
    static logInit() {

        const logFormatter = function logFormatter(options) {
            // Return string will be passed to logger.
            return '[' + Log.padRight(options.level.toUpperCase(), ' ', 5) + '][' + options.timestamp() + ']- ' + (options.message ? options.message : '') + (options.meta && (0, _keys2.default)(options.meta).length ? '\n\t' + (0, _stringify2.default)(options.meta) : '');
        };

        const timestamp = function timestamp() {
            return (0, _moment2.default)(new Date()).format('YYYY-MM-DD hh:mm:ss.SSSSSS');
        };

        let filePath = _environment2.default.logFile.filePath;
        this.Log = new _winston2.default.Logger({
            transports: [new _winston2.default.transports.DailyRotateFile({
                dirname: filePath,
                filename: './log',
                datePattern: 'yyyyMMdd-HH.',
                maxsize: '5242880', //5MB
                localTime: true,
                prepend: true,
                level: this.eLogLevel.silly,
                createTree: true,
                colorize: true,
                prettyPrint: true,
                json: false,
                timestamp: timestamp,
                formatter: logFormatter
            })]
        });
    }

    /* Write log to file and/or stackify */
    static writeLog(Level, message, uniqueId = null) {
        if (uniqueId) this.Log.log(Level, '[' + uniqueId + '] ' + message);else this.Log.log(Level, message);
    }
};

// export the class

Log.eLogLevel = {
    error: 'error',
    warn: 'warn',
    info: 'info',
    verbose: 'verbose',
    debug: 'debug',
    silly: 'silly'
};
module.exports = Log;
//# sourceMappingURL=Log.js.map
