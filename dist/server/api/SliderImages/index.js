'use strict';

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./SliderImages.controller');


var router = express.Router();

// 01. GET   /api/SliderImages/
router.get('/', controller.index);

// 02. DELETE   /api/SliderImages/:ID
router.delete('/:sliderImageId', _validation2.default.validateAuthorization, controller.deleteSliderImage);

// 03. ADD NEW   /api/SliderImages/
router.post('/', _validation2.default.validateAuthorization, controller.addNewSliderImage);

module.exports = router;
//# sourceMappingURL=index.js.map
