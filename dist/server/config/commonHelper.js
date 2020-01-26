'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.errorJsonResponse = errorJsonResponse;
exports.getGuid = getGuid;
exports.setCache = setCache;
exports.getCache = getCache;
const uuidv1 = require('uuid/v1');
const NodeCache = require("node-cache");

const myCache = new NodeCache();
//Change the SecretKey
const jwtdata = exports.jwtdata = { jwtSecretKey: '12334' };

let path = __dirname.replace('config', '');

const serviceImageUploadLocation = exports.serviceImageUploadLocation = { path: path.replace(/\\/g, '/') + 'images/service/', dbpath: 'images/service/' };
const GalleryImageUploadLocation = exports.GalleryImageUploadLocation = { path: path.replace(/\\/g, '/') + 'images/Gallery/', dbpath: 'images/Gallery/' };
const UserAvatarImageUploadLocation = exports.UserAvatarImageUploadLocation = { path: path.replace(/\\/g, '/') + 'images/UserAvatar/', dbpath: 'images/UserAvatar/' };
const SliderImageUploadLocation = exports.SliderImageUploadLocation = { path: path.replace(/\\/g, '/') + 'images/SliderImages/', dbpath: 'images/SliderImages/' };
const ProductImageUploadLocation = exports.ProductImageUploadLocation = { path: path.replace(/\\/g, '/') + 'images/ProductImage/', dbpath: 'images/ProductImage/' };

//error message response
function errorJsonResponse(dev_msg, user_msg) {
    return {
        dev_msg: dev_msg,
        user_msg: user_msg
    };
}

function getGuid() {
    return uuidv1();
}

function setCache(key, value) {
    myCache.set(key, value, 10000);
}

function getCache(key) {
    let value = myCache.get(key);
    if (value === undefined) {
        return null;
    }
    return value;
}
//# sourceMappingURL=commonHelper.js.map
