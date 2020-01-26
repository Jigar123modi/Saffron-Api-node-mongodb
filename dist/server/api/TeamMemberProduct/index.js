'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./TeamMemberProduct.controller');


var router = express.Router();

// 01. POST   /api/Teams/addTeamService
router.post('/addTeamProduct', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.addTeamService), controller.addTeamProduct);

// 02. POST   /api/Teams/removeTeamService
router.post('/removeTeamProduct', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.RemoveTeamService), controller.removeTeamProduct);

// 03. Get /api/Teams/TeamMemberProducts
router.get('/:teamMemberId', _validation2.default.validateAuthorization, controller.teamMemberProductsList);

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
