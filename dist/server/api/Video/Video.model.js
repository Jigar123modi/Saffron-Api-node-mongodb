'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Video = require('./Video.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VideoSchema = new _mongoose2.default.Schema({
    id: String,
    service_id: String,
    video_url: String,
    title: String,
    description: String,
    date: String,
    sex: String
});

(0, _Video.registerEvents)(VideoSchema);
exports.default = _mongoose2.default.model('Video', VideoSchema);
//# sourceMappingURL=Video.model.js.map
