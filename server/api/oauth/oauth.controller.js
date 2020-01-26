import Oauth from './oauth.model';
import Booking from '../Booking/Booking.model';
import moment from 'moment/moment';
import {jwtdata, errorJsonResponse, getGuid, UserAvatarImageUploadLocation} from '../../config/commonHelper';
import jwt from 'jsonwebtoken';

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode)
                .json(entity);
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode)
            .send(err);
    };
}

// Gets a list of oauth
export function index(req, res) {
    return Oauth.find({role: 'user'}, {_id: 0, __v: 0, password: 0})
        .exec()
        .then(respondWithResult(res, 200))
        .catch(handleError(res));
}

// Get userList based on Mobile Number
export function index_contactNo(req, res) {
    let contactNo = '^' + req.params.contactNo + '.*';
    return Oauth.find({userId: {$regex: contactNo}, role: 'user'}, {_id: 0, __v: 0})
        .exec()
        .then(respondWithResult(res, 200))
        .catch(handleError(res));
}

//Login Valid User
export function login(req, res) {
    if(req.body) {
        let pass;
        let userId;
        let check_field = true;

        if(req.body.userId) {
            userId = req.body.userId;
            if(req.body.password) {
                pass = req.body.password;
            } else {
                check_field = false;
                res.status(500)
                    .json(errorJsonResponse('password is required', 'password is required'));
            }
        } else {
            check_field = false;
            res.status(500)
                .json(errorJsonResponse('userId is required', 'userId is required'));
        }

        if(check_field) {

            Oauth.findOne({userId: userId, password: pass, block: false}, {_id: 0, __v: 0})
                .exec(async function(err, loginUser) {
                    if(!err) {
                        if(loginUser) {
                            let expiresIn = 60 * 60 * 24; // expires in 24 hours
                            let issued = moment(Date.now());
                            let accessToken = jwt.sign({user: loginUser}, jwtdata.jwtSecretKey, {
                                expiresIn: expiresIn
                            });
                            let expires = moment(issued)
                                .add(expiresIn, 'seconds');

                            res.status(200)
                                .json({
                                    accessToken,
                                    expiresIn,
                                    issued,
                                    expires
                                });
                        } else {
                            res.status(400)
                                .json(errorJsonResponse('Invalid user', 'Invalid user'));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse(err, 'sorry, come to the shop.'));
                    }
                });
        }
    }
}

export function register(req, res, next) {
    if(req.body) {

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let mobile_number = req.body.mobile_number;
        let password = req.body.password;
        let role = req.body.role;
        let email_id = req.body.email_id;


        try {

            let alreadyAvailable = false;
            //check mobile number is already register or not
            Oauth.findOne({userId: mobile_number})
                .exec(function(err, findUser) {

                    if(findUser) {
                        alreadyAvailable = true;
                    }

                    if(!alreadyAvailable) {

                        let registrationUser = new Oauth({
                            id: getGuid(),
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
                        registrationUser.save()
                            .then(function(RegistrationSuccess, err) {
                                if(!err) {
                                    if(RegistrationSuccess) {

                                        let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                        let issued = moment(Date.now());
                                        let accessToken = jwt.sign({user: RegistrationSuccess}, jwtdata.jwtSecretKey, {
                                            expiresIn: expiresIn
                                        });
                                        let expires = moment(issued)
                                            .add(expiresIn, 'seconds');
                                        res.status(200)
                                            .json({
                                                data: RegistrationSuccess,
                                                accessToken,
                                                expiresIn,
                                                issued,
                                                expires,
                                                result: 'Registration Successfully'
                                            });

                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse('Error in db response', 'Invalid_Image'));
                                    }
                                } else {
                                    res.status(400)
                                        .json(errorJsonResponse(err, 'Contact to your Developer'));
                                }
                            });

                    } else {
                        res.status(400)
                            .json(errorJsonResponse('Mobile number is already register', 'Mobile number is already register'));
                    }
                });
        }
        catch
            (error) {
            res.status(400)
                .json(errorJsonResponse(error, 'contact to developer'));
        }
    }
}

export function updateUser(req, res, next) {
    if(req.body) {

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

            if(mobile_number.toString() === old_mobile_number.toString()) {

                Oauth.update({userId: old_mobile_number},
                    {
                        first_name: first_name,
                        last_name: last_name,
                        contact_no: mobile_number,
                        email_id: emailAddress,
                        userId: mobile_number,
                        password: password,
                        role: role,
                        block: block
                    }
                )
                    .exec(function(err, UpdateUser) {
                        if(!err) {
                            if(UpdateUser) {
                                if(UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                                    let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                    let issued = moment(Date.now());
                                    let accessToken = jwt.sign({user: userObject}, jwtdata.jwtSecretKey, {
                                        expiresIn: expiresIn
                                    });
                                    let expires = moment(issued)
                                        .add(expiresIn, 'seconds');
                                    res.status(200)
                                        .json({
                                            accessToken,
                                            expiresIn,
                                            issued,
                                            expires,
                                            result: 'Updated Successfully'
                                        });

                                } else {
                                    res.status(400)
                                        .json(errorJsonResponse('not found', 'not found'));
                                }

                            } else {
                                res.status(400)
                                    .json(errorJsonResponse('Invalid_Image', 'Invalid_Image'));
                            }
                        } else {
                            res.status(400)
                                .json(errorJsonResponse(err, 'Contact to your Developer'));
                        }
                    });

            } else {

                let alreadyAvailable = false;
                //check mobile number is already register or not
                Oauth.find({userId: mobile_number})
                    .exec(function(err, findUser) {

                        if(findUser.length > 0) {
                            alreadyAvailable = true;
                        }

                        if(!alreadyAvailable) {

                            Oauth.update({userId: old_mobile_number},
                                {
                                    first_name: first_name,
                                    last_name: last_name,
                                    contact_no: mobile_number,
                                    email_id: '',
                                    userId: mobile_number,
                                    password: password,
                                    role: role,
                                    block: block
                                }
                            )
                                .exec(function(err, UpdateUser) {
                                    if(!err) {
                                        if(UpdateUser) {
                                            if(UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                                                let expiresIn = 60 * 60 * 24; // expires in 24 hours
                                                let issued = moment(Date.now());
                                                let accessToken = jwt.sign({user: userObject}, jwtdata.jwtSecretKey, {
                                                    expiresIn: expiresIn
                                                });
                                                let expires = moment(issued)
                                                    .add(expiresIn, 'seconds');
                                                res.status(200)
                                                    .json({
                                                        accessToken,
                                                        expiresIn,
                                                        issued,
                                                        expires,
                                                        result: 'Updated Successfully'
                                                    });

                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse('Not Found', 'Not Found'));
                                            }

                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse('Invalid Image', 'Invalid Image'));
                                        }
                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse(err, 'Contact to your Developer'));
                                    }
                                });

                        } else {
                            res.status(400)
                                .json(errorJsonResponse('Mobile number is already register', 'Mobile number is already register'));
                        }
                    });
            }
        }
        catch
            (error) {
            res.status(400)
                .json(errorJsonResponse(error, 'Contact to Developer'));
        }
    }
}

export function deleteUser(req, res, next) {
    try {
        let userId = req.params.userId;
        Oauth.remove({id: userId})
            .exec(function(err, DeleteUser) {
                if(!err) {
                    if(DeleteUser) {
                        if(DeleteUser.result.n === 1) {
                            res.status(200)
                                .json({id: userId, result: 'Deleted Successfully'});
                        } else {
                            res.status(400)
                                .json(errorJsonResponse('Deleted Fail', 'Deleted Fail'));
                        }

                    } else {
                        res.status(400)
                            .json(errorJsonResponse('Invalid Post', 'Invalid Post'));
                    }
                } else {
                    res.status(400)
                        .json(errorJsonResponse(err, 'Contact to your Developer'));
                }
            });

    } catch(error) {
        res.status(400)
            .json(error);
    }
}

export function uploadUserAvatar(req, res, next) {
    try {

        let form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {

            if(Object.keys(files).length > 0 && isImage(files.filetoupload.name)) {
                let uuid = getGuid();
                let oldpath = files.filetoupload.path;
                let newpath = UserAvatarImageUploadLocation.path + files.filetoupload.name;
                let dbpath = UserAvatarImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = UserAvatarImageUploadLocation.path + uuid + files.filetoupload.name;
                let login_user = req.decoded;

                fs_extra.move(oldpath, newpath, function(err) {
                    if(err) {
                        res.status(400)
                            .json(errorJsonResponse(err.toString(), 'Same Name Image Already Available On Server'));
                    } else {
                        fs.rename(newpath, renameFilePath, function(err) {
                            if(err) {
                                res.status(400)
                                    .json(errorJsonResponse(err.toString(), 'Fail to Rename file'));
                            } else {
                                Oauth.update({userId: login_user.user.userId}, {
                                    image_url: dbpath,
                                })
                                    .exec(function(err, UpdateOauth) {
                                        if(!err) {
                                            if(UpdateOauth) {
                                                if(UpdateOauth.nModified === 1 || UpdateOauth.n === 1) {
                                                    res.status(200)
                                                        .json({
                                                            data: dbpath,
                                                            result: 'updated Successfully '
                                                        });
                                                } else {
                                                    res.status(400)
                                                        .json(errorJsonResponse('not found', 'not found'));
                                                }
                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse('Invalid_Image', 'Invalid_Image'));
                                            }
                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse(err, 'Contact to your Developer'));
                                        }
                                    });
                            }
                        });
                    }
                });
            } else {
                res.status(400)
                    .json(errorJsonResponse('Invalid Request', 'Invalid Request'));
            }
        });
    }
    catch(error) {
        res.status(400)
            .json(errorJsonResponse(error.message.toString(), error.message.toString()));
    }
}

export function changeUserBlockStatus(req, res, next) {
    if(req.body) {

        let requestObject = {
            contact_no: req.body.mobile_number,
            block: req.body.block,
        };

        try {
            Oauth.update({userId: requestObject.contact_no},
                {
                    block: requestObject.block
                }
            )
                .exec(function(err, UpdateUser) {
                    if(!err) {
                        if(UpdateUser) {
                            if(UpdateUser.nModified === 1 || UpdateUser.n === 1) {

                                res.status(200)
                                    .json({
                                        data: requestObject,
                                        result: 'Updated Successfully'
                                    });

                            } else {
                                res.status(400)
                                    .json(errorJsonResponse('not found', 'not found'));
                            }

                        } else {
                            res.status(400)
                                .json(errorJsonResponse('Result Null', 'Result Null'));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse(err, 'Sorry retry again'));
                    }
                });
        }
        catch(error) {
            res.status(400)
                .json(errorJsonResponse(error.message.toString(), 'Contact to your Developer'));
        }
    }
}

export async function getTodayOrderList(req, res, next) {
    try {
        let userId = req.decoded.user.userId;
        let startDayDateTime = moment()
            .tz('Asia/Kolkata')
            .startOf('day')
            .format();
        let endDayDateTime = moment()
            .tz('Asia/Kolkata')
            .endOf('day')
            .format();
        let NormalDateStartDateTime = new Date(startDayDateTime);
        let NormalDateEndDateTime = new Date(endDayDateTime);

        const getCurrentDayOrders = await Booking.find({
            customer_id: userId,
            bookingEndTime: {
                $gte: NormalDateStartDateTime.toUTCString(),
                $lte: NormalDateEndDateTime.toUTCString()
            }
        }, {teamWiseProductList: 0})
            .sort({bookingDateTime: -1})
            .exec();

        let UserPoints = await Oauth.findOne({userId: userId}, {saffronPoint: 1, _id: 0})
            .exec();

        res.status(200)
            .json({
                TodayOrders: getCurrentDayOrders,
                UserPoints
            });

    } catch(error) {
        res.status(400)
            .json(errorJsonResponse(error.message.toString(), 'Contact to your Developer'));
    }
}

