'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./Team.controller');


var router = express.Router();

// 01. GET   /api/Teams/
router.get('/', controller.index);

// 02. DELETE   /api/Teams/:ID
router.delete('/:teamId', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.deleteTeamId), controller.deleteTeam);

// 03. ADD NEW   /api/Teams/
router.post('/', _validation2.default.validateAuthorization, controller.addNewTeam);

// 04. UPDATE   /api/Teams/
router.put('/', _validation2.default.validateAuthorization, controller.updateTeam);

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
