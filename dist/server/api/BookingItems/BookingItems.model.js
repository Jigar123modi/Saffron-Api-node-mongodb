'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BookingItemsSchema = new _mongoose2.default.Schema({
    id: String,
    booking_id: String,
    product_id: String,
    team_id: String,
    active: Boolean
});

exports.default = _mongoose2.default.model('BookingItems', BookingItemsSchema);
//# sourceMappingURL=BookingItems.model.js.map
