import jwt from 'jsonwebtoken';
import {jwtdata} from '../../config/commonHelper';
import Joi from 'joi';

export default {
    // route middleware to verify a token
    validateAuthorization: function (req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            }
            else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.',
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.',
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
                            dev_msg: 'UnAuthorized user.',
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
                dev_msg: 'No token provided.',
            });
        }
    },

    validateAuthorizationEmployee: function (req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            }
            else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.',
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.',
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
                            dev_msg: 'UnAuthorized user.',
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
                dev_msg: 'No token provided.',
            });
        }
    },

    validateAdminEmployeeAuthorization: function (req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            }
            else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.',
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.',
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
                            dev_msg: 'UnAuthorized user.',
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
                dev_msg: 'No token provided.',
            });
        }
    },

    validateAuthorizationUser: function (req, res, next) {
        // check header or url parameters or post parameters for token
        var authorizationHeader = req.headers['authorization'];
        var token = '';
        if (authorizationHeader) {
            var headerParts = authorizationHeader.trim().split(' ');
            if (headerParts[0].toLowerCase() === 'bearer') {
                token = headerParts[headerParts.length - 1];
            }
            else {
                var statusCode = 401;
                return res.status(statusCode).json({
                    user_msg: 'Failed to authenticate token.',
                    dev_msg: 'Failed to authenticate token.',
                });
            }
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, jwtdata.jwtSecretKey, function (err, decoded) {
                if (err) {
                    var statusCode = 401;
                    return res.status(statusCode).json({
                        user_msg: 'Failed to authenticate token.',
                        dev_msg: 'Failed to authenticate token.',
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
                dev_msg: 'No token provided.',
            });
        }
    },


    newBookingOrder: {
        body: {
            startTime: Joi.object({
                hours: Joi.number().required(),
                minutes: Joi.number().required(),
            }).required(),
            endTime: Joi.object({
                hours: Joi.number().required(),
                minutes: Joi.number().required(),
            }).required(),
        }
    },


    updateBookingOrder :{
        body: {
            orderType: Joi.string().required()
        }
    }


};
