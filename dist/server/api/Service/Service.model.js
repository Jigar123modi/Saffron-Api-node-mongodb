'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Service = require('./Service.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//var ttl = require('mongoose-ttl');

var ServiceSchema = new _mongoose2.default.Schema({
    id: String,
    title: String,
    image_url: String,
    description: String,
    displayOrder: Number,
    date: String
});

//ServiceSchema.plugin(ttl, {ttl: (1000 * 60 * 5)});

(0, _Service.registerEvents)(ServiceSchema);
exports.default = _mongoose2.default.model('Service', ServiceSchema);
//# sourceMappingURL=Service.model.js.map
