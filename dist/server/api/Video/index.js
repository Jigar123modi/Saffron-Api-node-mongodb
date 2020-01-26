'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./Video.controller');


var router = express.Router();

// 01. DELETE   /api/Videos/:ID
router.delete('/:videoId', _validation2.default.validateAuthorization, controller.deleteVideo);

// 02. ADD NEW   /api/Videos/
router.post('/', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.videoAdd), controller.addNewVideo);

// 03. UPDATE   /api/Videos/
router.put('/', _validation2.default.validateAuthorization, (0, _expressValidation2.default)(_validation2.default.videoUpdate), controller.updateGallery);

// 04. GET /api/Videos/All/:serviceId
router.get('/All/:serviceId', controller.allVideos);

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
