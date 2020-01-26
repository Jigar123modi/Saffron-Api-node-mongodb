'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _TeamMemberProduct = require('./TeamMemberProduct.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TeamMemberProductSchema = new _mongoose2.default.Schema({
    id: String,
    teamMember_id: String,
    product_id: String,
    approxTime: Number
});

(0, _TeamMemberProduct.registerEvents)(TeamMemberProductSchema);
exports.default = _mongoose2.default.model('TeamMemberProduct', TeamMemberProductSchema);
//# sourceMappingURL=TeamMemberProduct.model.js.map
