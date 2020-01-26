'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./Service.controller');


var router = express.Router();

// 01. GET   /api/Services/
router.get('/', controller.index);

// 02. DELETE   /api/Services/:ID
router.delete('/:serviceId', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.deleteServiceId), controller.deleteService);

// 03. ADD NEW   /api/Services/
router.post('/', _validation2.default.validateAuthorization, controller.addNewService);

// 04. UPDATE   /api/Services/
router.put('/', _validation2.default.validateAuthorization, controller.updateService);

//05. Testing /api/Services/testingSocket
router.post('/testingSocket', controller.testingPublishSocket);

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
