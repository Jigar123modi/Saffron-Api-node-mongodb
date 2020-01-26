'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./Product.controller');


var router = express.Router();

// 01. GET   /api/Products/
router.get('/', controller.index);

// 02. GET /api/Products/allProduct/
router.get('/allProduct', controller.allProduct);

// 02. POST /api/Products/
router.post('/', _validation2.default.validateAuthorization, controller.addNewProduct);

// 03. PUT /api/Products/
router.put('/', _validation2.default.validateAuthorization, controller.updateProduct);

// 04. DELETE /api/Products/
router.delete('/:productId', _validation2.default.validateAuthorization, controller.deleteProduct);

// 05. GET   /api/Products/teamMember
router.get('/teamMember/:productId', controller.teamMember);

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
