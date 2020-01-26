'use strict';

var express = require('express');
var controller = require('./oauth.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

// 01. GET   /api/oauth/
router.get('/', validations.validateAuthorization, controller.index);

//07 .  Get /api/oauth/changeUserBlockStatus
router.get('/getTodayOrderList', validations.validateAuthorizationUser, controller.getTodayOrderList);

//03 .  Get /api/oauth/:contactNumber
router.get('/:contactNo', validations.validateAuthorization, controller.index_contactNo);

// 02. POST   /api/oauth/login
router.post('/login', controller.login);

//03 . POST /api/oauth/register
router.post('/register', validate(validations.registerValidate), controller.register);

//04 . DELETE /api/oauth/delete
router.delete('/:userId', validations.validateAuthorization, validate(validations.deleteUserId), controller.deleteUser);

//05 . UPDATE /api/oauth/
router.put('/', validations.validateAuthorizationUser, validate(validations.updateUser), controller.updateUser);

//06 .  POST /api/oauth/userAvatar
router.post('/userAvatar', validations.validateAuthorizationUser, controller.uploadUserAvatar);

//07 .  POST /api/oauth/changeUserBlockStatus
router.post('/changeUserBlockStatus', validations.validateAuthorization, controller.changeUserBlockStatus);


router.use(function (err, req, res, next) {
    let arrayMessages = [];
    let allErrorField;
    for (let i = 0; i < err.errors.length; i++) {
        let Single_error = err.errors[i].messages.toString().replace(/"/g, '');
        arrayMessages.push(Single_error);
    }
    allErrorField = arrayMessages.join(",");
    res.status(400).json(errorJsonResponse(allErrorField, allErrorField));
});

module.exports = router;
