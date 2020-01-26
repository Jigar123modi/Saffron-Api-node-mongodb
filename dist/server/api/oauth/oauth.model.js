'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _oauth = require('./oauth.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OauthSchema = new _mongoose2.default.Schema({
    id: String,
    first_name: String,
    last_name: String,
    description: String,
    contact_no: Number,
    email_id: String,
    userId: String,
    password: String,
    role: String,
    block: Boolean,
    image_url: String
});

(0, _oauth.registerEvents)(OauthSchema);
exports.default = _mongoose2.default.model('login', OauthSchema);
//# sourceMappingURL=oauth.model.js.map
