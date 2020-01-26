'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Product = require('./Product.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ProductSchema = new _mongoose2.default.Schema({
    id: String,
    service_id: String,
    price: Number,
    offerPrice: Number,
    image_url: String,
    title: String,
    description: String,
    bookingValue: Boolean,
    date: String,
    sex: String
});

(0, _Product.registerEvents)(ProductSchema);
exports.default = _mongoose2.default.model('Product', ProductSchema);
//# sourceMappingURL=Product.model.js.map
