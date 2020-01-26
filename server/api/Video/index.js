var express = require('express');
var controller = require('./Video.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

// 01. DELETE   /api/Videos/:ID
router.delete('/:videoId', validations.validateAuthorization, controller.deleteVideo);

// 02. ADD NEW   /api/Videos/
router.post('/', validations.validateAuthorization, validate(validations.videoAdd), controller.addNewVideo);

// 03. UPDATE   /api/Videos/
router.put('/', validations.validateAuthorization, validate(validations.videoUpdate), controller.updateGallery);

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
    res.status(400).json(errorJsonResponse(allErrorField, allErrorField));
});

module.exports = router;
