var express = require('express');
var controller = require('./Gallery.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';


var router = express.Router();

// 01. GET   /api/Gallery/
router.get('/', controller.index);

// 02. DELETE   /api/Gallery/:ID
router.delete('/:galleryId', validations.validateAuthorization, controller.deleteGallery);

// 03. ADD NEW   /api/Gallery/
router.post('/', validations.validateAuthorization, controller.addNewGallery);

// 04. UPDATE   /api/Gallery/
router.put('/', validations.validateAuthorization, controller.updateGallery);

// 05. GET /api/Gallery/All/:PageNo
router.get('/All/:serviceId', controller.allGallery);

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
