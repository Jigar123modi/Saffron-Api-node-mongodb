'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./oauth.controller');


var router = express.Router();

// 01. GET   /api/oauth/
router.get('/', _validation2.default.validateAuthorization, controller.index);

//07 .  Get /api/oauth/changeUserBlockStatus
router.get('/getTodayOrderList', _validation2.default.validateAuthorizationUser, controller.getTodayOrderList);

//03 .  Get /api/oauth/:contactNumber
router.get('/:contactNo', _validation2.default.validateAuthorization, controller.index_contactNo);

// 02. POST   /api/oauth/login
router.post('/login', controller.login);

//03 . POST /api/oauth/register
router.post('/register', (0, _expressValidation2.default)(_validation2.default.registerValidate), controller.register);

//04 . DELETE /api/oauth/delete
router.delete('/:userId', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.deleteUserId), controller.deleteUser);

//05 . UPDATE /api/oauth/
router.put('/', _validation2.default.validateAuthorizationUser, (0, _expressValidation2.default)(_validation2.default.updateUser), controller.updateUser);

//06 .  POST /api/oauth/userAvatar
router.post('/userAvatar', _validation2.default.validateAuthorizationUser, controller.uploadUserAvatar);

//07 .  POST /api/oauth/changeUserBlockStatus
router.post('/changeUserBlockStatus', _validation2.default.validateAuthorization, controller.changeUserBlockStatus);

router.use(function (err, req, res, next) {
    let arrayMessages = [];
    let allErrorField;
    for (let i = 0; i < err.errors.length; i++) {
        let Single_error = err.errors[i].messages.toString().replace(/"/g, '');
        arrayMessages.push(Single_error);
    }
    allErrorField = arrayMessages.join(",");
    res.status(400).json((0, _commonHelper.errorJsonResponse)(allErrorField, allErrorField));
});

module.exports = router;
//# sourceMappingURL=index.js.map
