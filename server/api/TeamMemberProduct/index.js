var express = require('express');
var controller = require('./TeamMemberProduct.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';


var router = express.Router();

// 01. POST   /api/Teams/addTeamService
router.post('/addTeamProduct', validations.validateAuthorization, validate(validations.addTeamService), controller.addTeamProduct);

// 02. POST   /api/Teams/removeTeamService
router.post('/removeTeamProduct', validations.validateAuthorization, validate(validations.RemoveTeamService), controller.removeTeamProduct);

// 03. Get /api/Teams/TeamMemberProducts
router.get('/:teamMemberId', validations.validateAuthorization, controller.teamMemberProductsList);

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
