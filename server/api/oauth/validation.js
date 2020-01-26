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

    registerValidate: {
        body: {
            first_name: Joi.string().regex(/^[a-zA-Z]$/).required(),
            last_name: Joi.string().regex(/^[a-zA-Z]$/).required(),
            mobile_number: Joi.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/).required(),
            password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('password')),
            role: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            email_id: Joi.string().email({minDomainAtoms: 2})
        }
    },

    deleteUserId: {
        params: {
            userId: Joi.string().required()
        }
    },

    updateUser: {
        body: {
            first_name: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            last_name: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
            mobile_number: Joi.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/).required(),
            password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('password')),
            block: Joi.boolean().required(),
        }
    }


};
