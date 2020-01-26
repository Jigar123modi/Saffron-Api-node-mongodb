'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _commonHelper = require('../../config/commonHelper');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    // route middleware to verify a token
    validateAuthorization: function validateAuthorization(req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            } else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.'
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            _jsonwebtoken2.default.verify(token, _commonHelper.jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    if (decoded.user.role.toLowerCase() === "admin") {
                        req.decoded = decoded;
                        next();
                    } else {
                        var statusCode = 403;
                        return res.status(statusCode).json({
                            user_msg: 'UnAuthorized user.',
                            dev_msg: 'UnAuthorized user.'
                        });
                    }
                }
            });
        } else {
            // if there is no token
            // return an error
            var statusCode = 401;
            return res.status(statusCode).json({
                user_msg: 'No token provided.',
                dev_msg: 'No token provided.'
            });
        }
    },

    validateAuthorizationEmployee: function validateAuthorizationEmployee(req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            } else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.'
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            _jsonwebtoken2.default.verify(token, _commonHelper.jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    if (decoded.user.role.toString() === "employee") {
                        req.decoded = decoded;
                        next();
                    } else {
                        var statusCode = 403;
                        return res.status(statusCode).json({
                            user_msg: 'UnAuthorized user.',
                            dev_msg: 'UnAuthorized user.'
                        });
                    }
                }
            });
        } else {
            // if there is no token
            // return an error
            var statusCode = 401;
            return res.status(statusCode).json({
                user_msg: 'No token provided.',
                dev_msg: 'No token provided.'
            });
        }
    },

    validateAdminEmployeeAuthorization: function validateAdminEmployeeAuthorization(req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            } else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.'
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            _jsonwebtoken2.default.verify(token, _commonHelper.jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    if (decoded.user.role.toLowerCase() === "admin" || decoded.user.role.toLowerCase() === "employee") {
                        req.decoded = decoded;
                        next();
                    } else {
                        var statusCode = 403;
                        return res.status(statusCode).json({
                            user_msg: 'UnAuthorized user.',
                            dev_msg: 'UnAuthorized user.'
                        });
                    }
                }
            });
        } else {
            // if there is no token
            // return an error
            var statusCode = 401;
            return res.status(statusCode).json({
                user_msg: 'No token provided.',
                dev_msg: 'No token provided.'
            });
        }
    },

    validateAuthorizationUser: function validateAuthorizationUser(req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            } else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.'
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            _jsonwebtoken2.default.verify(token, _commonHelper.jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            var statusCode = 401;
            return res.status(statusCode).json({
                user_msg: 'No token provided.',
                dev_msg: 'No token provided.'
            });
        }
    },

    newBookingOrder: {
        body: {
            startTime: _joi2.default.object({
                hours: _joi2.default.number().required(),
                minutes: _joi2.default.number().required()
            }).required(),
            endTime: _joi2.default.object({
                hours: _joi2.default.number().required(),
                minutes: _joi2.default.number().required()
            }).required()
        }
    },

    updateBookingOrder: {
        body: {
            orderType: _joi2.default.string().required()
        }
    }

};
//# sourceMappingURL=validation.js.map
