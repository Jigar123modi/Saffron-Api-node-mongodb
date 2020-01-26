'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _SliderImages = require('./SliderImages.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SliderImagesSchema = new _mongoose2.default.Schema({
    id: String,
    image_url: String
});

(0, _SliderImages.registerEvents)(SliderImagesSchema);
exports.default = _mongoose2.default.model('SliderImages', SliderImagesSchema);
//# sourceMappingURL=SliderImages.model.js.map
