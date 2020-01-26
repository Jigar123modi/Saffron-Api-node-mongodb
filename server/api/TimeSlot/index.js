var express = require('express');
var controller = require('./TimeSlot.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

//Get All Time Slot (for User) time slot display according to current time
router.get('/', controller.index);

//Get All Time Slot
router.get('/GetAllTimeSlots', validations.validateAuthorization, controller.getAllTimeSlot);

//Add new Time Slot
router.post('/', validations.validateAuthorization, validate(validations.addTimeSlot), controller.addTimeSlot);

//Update Time Slot
router.put('/', validate(validations.editTimeSlot), controller.editTimeSlot);

//Delete Time Slot
router.delete('/:timeSlot_id', validations.validateAuthorization, controller.deleteTimeSlot);

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
