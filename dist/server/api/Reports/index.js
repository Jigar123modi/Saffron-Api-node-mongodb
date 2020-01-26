'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let express = require('express');
let controller = require('./reports.controller');
let router = express.Router();


//01 . GET /api/Reports/topUser
router.get('/topUsers', _validation2.default.validateAuthorization, controller.getTopUser);

//02 . GET /api/Reports/getTotalBillablePrice
router.get('/getTotalBillablePrice', _validation2.default.validateAuthorization, controller.getTotalBillablePrice);

//03 . GET /api/Reports/getOrderReport
router.get('/getOrderStatusReport', _validation2.default.validateAuthorization, controller.getOrderStatusReport);

//04 . GET /api/Reports/getTeamWiseOrderStatusReport
router.get('/getTeamWiseOrderStatusReport', _validation2.default.validateAuthorization, controller.getTeamWiseOrderStatusReport);

router.use(function (err, req, res, next) {
    let arrayMessages = [];
    let allErrorField;
    if (err.errors) {
        for (let i = 0; i < err.errors.length; i++) {
            let Single_error = err.errors[i].messages.toString().replace(/"/g, '');
            arrayMessages.push(Single_error);
        }
        allErrorField = arrayMessages.join(",");
        res.status(400).json((0, _commonHelper.errorJsonResponse)(allErrorField, allErrorField));
    } else {
        next(err);
    }
});

module.exports = router;
//# sourceMappingURL=index.js.map
