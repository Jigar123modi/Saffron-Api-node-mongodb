var express = require('express');
var controller = require('./Service.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

// 01. GET   /api/Services/
router.get('/', controller.index);

// 02. DELETE   /api/Services/:ID
router.delete('/:serviceId', validations.validateAuthorization, validate(validations.deleteServiceId), controller.deleteService);

// 03. ADD NEW   /api/Services/
router.post('/', validations.validateAuthorization, controller.addNewService);

// 04. UPDATE   /api/Services/
router.put('/', validations.validateAuthorization, controller.updateService);

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
    res.status(400).json(errorJsonResponse(allErrorField, allErrorField));
});


module.exports = router;
