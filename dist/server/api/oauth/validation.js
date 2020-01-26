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

    registerValidate: {
        body: {
            first_name: _joi2.default.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            last_name: _joi2.default.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            mobile_number: _joi2.default.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/).required(),
            password: _joi2.default.string().required(),
            confirm_password: _joi2.default.string().required().valid(_joi2.default.ref('password')),
            role: _joi2.default.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            email_id: _joi2.default.string().email({ minDomainAtoms: 2 })
        }
    },

    deleteUserId: {
        params: {
            userId: _joi2.default.string().required()
        }
    },

    updateUser: {
        body: {
            first_name: _joi2.default.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            last_name: _joi2.default.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            mobile_number: _joi2.default.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/).required(),
            password: _joi2.default.string().required(),
            confirm_password: _joi2.default.string().required().valid(_joi2.default.ref('password')),
            block: _joi2.default.boolean().required()
        }
    }

};
//# sourceMappingURL=validation.js.map
