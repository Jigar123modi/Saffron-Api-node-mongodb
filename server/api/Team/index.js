var express = require('express');
var controller = require('./Team.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

// 01. GET   /api/Teams/
router.get('/', controller.index);

// 02. DELETE   /api/Teams/:ID
router.delete('/:teamId', validations.validateAuthorization, validate(validations.deleteTeamId), controller.deleteTeam);

// 03. ADD NEW   /api/Teams/
router.post('/', validations.validateAuthorization, controller.addNewTeam);

// 04. UPDATE   /api/Teams/
router.put('/', validations.validateAuthorization, controller.updateTeam);

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
