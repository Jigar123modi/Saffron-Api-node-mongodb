'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _TimeSlot = require('./TimeSlot.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeSlotSchema = new _mongoose2.default.Schema({
    id: String,
    start_time: String,
    end_time: String
});

(0, _TimeSlot.registerEvents)(TimeSlotSchema);
exports.default = _mongoose2.default.model('TimeSlot', TimeSlotSchema);
//# sourceMappingURL=TimeSlot.model.js.map
