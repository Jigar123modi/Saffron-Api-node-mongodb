'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Gallery = require('./Gallery.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GallerySchema = new _mongoose2.default.Schema({
    id: String,
    service_id: String,
    image_url: String,
    title: String,
    description: String,
    date: Date,
    sex: String
});

(0, _Gallery.registerEvents)(GallerySchema);
exports.default = _mongoose2.default.model('Gallery', GallerySchema);
//# sourceMappingURL=Gallery.model.js.map
