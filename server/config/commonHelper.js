const uuidv1 = require('uuid/v1');
const NodeCache = require("node-cache");

const myCache = new NodeCache();
//Change the SecretKey
export const jwtdata = {jwtSecretKey: '12334'};

let path  = __dirname.replace('config','');

export const serviceImageUploadLocation = {path:path.replace(/\\/g,'/') + 'images/service/',dbpath:'images/service/'};
export const GalleryImageUploadLocation = {path:path.replace(/\\/g,'/') + 'images/Gallery/',dbpath:'images/Gallery/'};
export const UserAvatarImageUploadLocation = {path:path.replace(/\\/g,'/') + 'images/UserAvatar/',dbpath:'images/UserAvatar/'};
export const SliderImageUploadLocation = {path:path.replace(/\\/g,'/') + 'images/SliderImages/',dbpath:'images/SliderImages/'};
export const ProductImageUploadLocation = {path:path.replace(/\\/g,'/') + 'images/ProductImage/',dbpath:'images/ProductImage/'};

//error message response
export function errorJsonResponse(dev_msg,user_msg) {
    return {
        dev_msg: dev_msg,
        user_msg: user_msg
    }
}

export function getGuid() {
    return uuidv1();
}

export function setCache(key, value) {
    myCache.set(key, value, 10000);
}

export function getCache(key) {
    let value = myCache.get(key);
    if (value === undefined) {
        return null;
    }
    return value;
}
