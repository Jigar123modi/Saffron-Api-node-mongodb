var express = require('express');
var controller = require('./SliderImages.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();


// 01. GET   /api/SliderImages/
router.get('/', controller.index);

// 02. DELETE   /api/SliderImages/:ID
router.delete('/:sliderImageId', validations.validateAuthorization, controller.deleteSliderImage);

// 03. ADD NEW   /api/SliderImages/
router.post('/', validations.validateAuthorization, controller.addNewSliderImage);


module.exports = router;
