'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _thing = require('./thing.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ThingSchema = new _mongoose2.default.Schema({
    name: String,
    info: String,
    active: Boolean
});

(0, _thing.registerEvents)(ThingSchema);
exports.default = _mongoose2.default.model('Thing', ThingSchema);
//# sourceMappingURL=thing.model.js.map
