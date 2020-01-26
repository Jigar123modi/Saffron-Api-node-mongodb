'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTodayOrderList = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getTodayOrderList = exports.getTodayOrderList = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        try {
            let userId = req.decoded.user.userId;
            let startDayDateTime = (0, _moment2.default)().tz('Asia/Kolkata').startOf('day').format();
            let endDayDateTime = (0, _moment2.default)().tz('Asia/Kolkata').endOf('day').format();
            let NormalDateStartDateTime = new Date(startDayDateTime);
            let NormalDateEndDateTime = new Date(endDayDateTime);

            const getCurrentDayOrders = yield _Booking2.default.find({
                customer_id: userId,
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                }
            }, { teamWiseProductList: 0 }).sort({ bookingDateTime: -1 }).exec();

            let UserPoints = yield _oauth2.default.findOne({ userId: userId }, { saffronPoint: 1, _id: 0 }).exec();

            res.status(200).json({
                TodayOrders: getCurrentDayOrders,
                UserPoints
            });
        } catch (error) {
            res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), 'Contact to your Developer'));
        }
    });

    return function getTodayOrderList(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
    };
})();

exports.index = index;
exports.index_contactNo = index_contactNo;
exports.login = login;
exports.register = register;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.uploadUserAvatar = uploadUserAvatar;
exports.changeUserBlockStatus = changeUserBlockStatus;

var _oauth = require('./oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

var _Booking = require('../Booking/Booking.model');

var _Booking2 = _interopRequireDefault(_Booking);

var _moment = require('moment/moment');

var _moment2 = _interopRequireDefault(_moment);

var _commonHelper = require('../../config/commonHelper');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of oauth
function index(req, res) {
    return _oauth2.default.find({ role: 'user' }, { _id: 0, __v: 0, password: 0 }).exec().then(respondWithResult(res, 200)).catch(handleError(res));
}

// Get userList based on Mobile Number
function index_contactNo(req, res) {
    let contactNo = '^' + req.params.contactNo + '.*';
    return _oauth2.default.find({ userId: { $regex: contactNo }, role: 'user' }, { _id: 0, __v: 0 }).exec().then(respondWithResult(res, 200)).catch(handleError(res));
}

//Login Valid User
function login(req, res) {
    if (req.body) {
        let pass;
        let userId;
        let check_field = true;

        if (req.body.userId) {
            userId = req.body.userId;
            if (req.body.password) {
                pass = req.body.password;
            } else {
                check_field = false;
                res.status(500).json((0, _commonHelper.errorJsonResponse)('password is required', 'password is required'));
            }
        } else {
            check_field = false;
            res.status(500).json((0, _commonHelper.errorJsonResponse)('userId is required', 'userId is required'));
        }

        if (check_field) {

            _oauth2.default.findOne({ userId: userId, password: pass, block: false }, { _id: 0, __v: 0 }).exec((() => {
                var _ref = (0, _asyncToGenerator3.default)(function* (err, loginUser) {
                    if (!err) {
                        if (loginUser) {
                            let expiresIn = 60 * 60 * 24; // expires in 24 hours
                            let issued = (0, _moment2.default)(Date.now());
                            let accessToken = _jsonwebtoken2.default.sign({ user: loginUser }, _commonHelper.jwtdata.jwtSecretKey, {
                                expiresIn: expiresIn
                            });
                            let expires = (0, _moment2.default)(issued).add(expiresIn, 'seconds');

                            res.status(200).json({
                                accessToken,
                                expiresIn,
                                issued,
                                expires
                            });
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid user', 'Invalid user'));
                        }
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'sorry, come to the shop.'));
                    }
                });

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            })());
        }
    }
}

function register(req, res, next) {
    if (req.body) {

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let mobile_number = req.body.mobile_number;
        let password = req.body.password;
        let role = req.body.role;
        let email_id = req.body.email_id;

        try {

            let alreadyAvailable = false;
            //check mobile number is already register or not
            _oauth2.default.findOne({ userId: mobile_number }).exec(function (err, findUser) {

                if (findUser) {
                    alreadyAvailable = true;
                }

                if (!alreadyAvailable) {

                    let registrationUser = new _oauth2.default({
                        id: (0, _commonHelper.getGuid)(),
                        first_name: first_name,
                        last_name: last_name,
                        contact_no: mobile_number,
                        email_id: email_id,
                        userId: mobile_number,
                        password: password,
                        role: role,
                        block: false,
                        image_url: ''
                    });
                    registrationUser.save().then(function (RegistrationSuccess, err) {
                        if (!err) {
                            if (RegistrationSuccess) {

                                let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                let issued = (0, _moment2.default)(Date.now());
                                let accessToken = _jsonwebtoken2.default.sign({ user: RegistrationSuccess }, _commonHelper.jwtdata.jwtSecretKey, {
                                    expiresIn: expiresIn
                                });
                                let expires = (0, _moment2.default)(issued).add(expiresIn, 'seconds');
                                res.status(200).json({
                                    data: RegistrationSuccess,
                                    accessToken,
                                    expiresIn,
                                    issued,
                                    expires,
                                    result: 'Registration Successfully'
                                });
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)('Error in db response', 'Invalid_Image'));
                            }
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                        }
                    });
                } else {
                    res.status(400).json((0, _commonHelper.errorJsonResponse)('Mobile number is already register', 'Mobile number is already register'));
                }
            });
        } catch (error) {
            res.status(400).json((0, _commonHelper.errorJsonResponse)(error, 'contact to developer'));
        }
    }
}

function updateUser(req, res, next) {
    if (req.body) {

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let mobile_number = req.body.mobile_number;
        let password = req.body.password;
        let role = req.decoded.user.role;
        let emailAddress = req.body.emailAddress;
        let block = req.body.block;
        let old_mobile_number = req.decoded.user.contact_no;

        let userObject = {
            id: req.decoded.user.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact_no: req.body.mobile_number,
            email_id: emailAddress,
            userId: req.body.mobile_number,
            image_url: req.body.image_url,
            password: req.body.password,
            role: role,
            block: req.body.block,
            _id: req.decoded.user._id
        };

        try {

            if (mobile_number.toString() === old_mobile_number.toString()) {

                _oauth2.default.update({ userId: old_mobile_number }, {
                    first_name: first_name,
                    last_name: last_name,
                    contact_no: mobile_number,
                    email_id: emailAddress,
                    userId: mobile_number,
                    password: password,
                    role: role,
                    block: block
                }).exec(function (err, UpdateUser) {
                    if (!err) {
                        if (UpdateUser) {
                            if (UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                                let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                let issued = (0, _moment2.default)(Date.now());
                                let accessToken = _jsonwebtoken2.default.sign({ user: userObject }, _commonHelper.jwtdata.jwtSecretKey, {
                                    expiresIn: expiresIn
                                });
                                let expires = (0, _moment2.default)(issued).add(expiresIn, 'seconds');
                                res.status(200).json({
                                    accessToken,
                                    expiresIn,
                                    issued,
                                    expires,
                                    result: 'Updated Successfully'
                                });
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)('not found', 'not found'));
                            }
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid_Image', 'Invalid_Image'));
                        }
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                    }
                });
            } else {

                let alreadyAvailable = false;
                //check mobile number is already register or not
                _oauth2.default.find({ userId: mobile_number }).exec(function (err, findUser) {

                    if (findUser.length > 0) {
                        alreadyAvailable = true;
                    }

                    if (!alreadyAvailable) {

                        _oauth2.default.update({ userId: old_mobile_number }, {
                            first_name: first_name,
                            last_name: last_name,
                            contact_no: mobile_number,
                            email_id: '',
                            userId: mobile_number,
                            password: password,
                            role: role,
                            block: block
                        }).exec(function (err, UpdateUser) {
                            if (!err) {
                                if (UpdateUser) {
                                    if (UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                                        let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                        let issued = (0, _moment2.default)(Date.now());
                                        let accessToken = _jsonwebtoken2.default.sign({ user: userObject }, _commonHelper.jwtdata.jwtSecretKey, {
                                            expiresIn: expiresIn
                                        });
                                        let expires = (0, _moment2.default)(issued).add(expiresIn, 'seconds');
                                        res.status(200).json({
                                            accessToken,
                                            expiresIn,
                                            issued,
                                            expires,
                                            result: 'Updated Successfully'
                                        });
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)('Not Found', 'Not Found'));
                                    }
                                } else {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid Image', 'Invalid Image'));
                                }
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                            }
                        });
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)('Mobile number is already register', 'Mobile number is already register'));
                    }
                });
            }
        } catch (error) {
            res.status(400).json((0, _commonHelper.errorJsonResponse)(error, 'Contact to Developer'));
        }
    }
}

function deleteUser(req, res, next) {
    try {
        let userId = req.params.userId;
        _oauth2.default.remove({ id: userId }).exec(function (err, DeleteUser) {
            if (!err) {
                if (DeleteUser) {
                    if (DeleteUser.result.n === 1) {
                        res.status(200).json({ id: userId, result: 'Deleted Successfully' });
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)('Deleted Fail', 'Deleted Fail'));
                    }
                } else {
                    res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid Post', 'Invalid Post'));
                }
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
            }
        });
    } catch (error) {
        res.status(400).json(error);
    }
}

function uploadUserAvatar(req, res, next) {
    try {

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if ((0, _keys2.default)(files).length > 0 && isImage(files.filetoupload.name)) {
                let uuid = (0, _commonHelper.getGuid)();
                let oldpath = files.filetoupload.path;
                let newpath = _commonHelper.UserAvatarImageUploadLocation.path + files.filetoupload.name;
                let dbpath = _commonHelper.UserAvatarImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = _commonHelper.UserAvatarImageUploadLocation.path + uuid + files.filetoupload.name;
                let login_user = req.decoded;

                fs_extra.move(oldpath, newpath, function (err) {
                    if (err) {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), 'Same Name Image Already Available On Server'));
                    } else {
                        fs.rename(newpath, renameFilePath, function (err) {
                            if (err) {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), 'Fail to Rename file'));
                            } else {
                                _oauth2.default.update({ userId: login_user.user.userId }, {
                                    image_url: dbpath
                                }).exec(function (err, UpdateOauth) {
                                    if (!err) {
                                        if (UpdateOauth) {
                                            if (UpdateOauth.nModified === 1 || UpdateOauth.n === 1) {
                                                res.status(200).json({
                                                    data: dbpath,
                                                    result: 'updated Successfully '
                                                });
                                            } else {
                                                res.status(400).json((0, _commonHelper.errorJsonResponse)('not found', 'not found'));
                                            }
                                        } else {
                                            res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid_Image', 'Invalid_Image'));
                                        }
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid Request', 'Invalid Request'));
            }
        });
    } catch (error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString()));
    }
}

function changeUserBlockStatus(req, res, next) {
    if (req.body) {

        let requestObject = {
            contact_no: req.body.mobile_number,
            block: req.body.block
        };

        try {
            _oauth2.default.update({ userId: requestObject.contact_no }, {
                block: requestObject.block
            }).exec(function (err, UpdateUser) {
                if (!err) {
                    if (UpdateUser) {
                        if (UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                            res.status(200).json({
                                data: requestObject,
                                result: 'Updated Successfully'
                            });
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)('not found', 'not found'));
                        }
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)('Result Null', 'Result Null'));
                    }
                } else {
                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Sorry retry again'));
                }
            });
        } catch (error) {
            res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), 'Contact to your Developer'));
        }
    }
}
//# sourceMappingURL=oauth.controller.js.map
