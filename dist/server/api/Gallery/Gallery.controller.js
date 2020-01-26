'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.allGallery = exports.index = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Gets a list of Gallery
let index = exports.index = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
        let GalleryList = (0, _commonHelper.getCache)('galleryLists');
        if (GalleryList !== null) {
            res.status(200).json(GalleryList);
        } else {
            GalleryList = yield _Gallery2.default.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).limit(8).exec();
            (0, _commonHelper.setCache)('galleryLists', GalleryList);
            res.status(200).json(GalleryList);
        }
    });

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let getGalleryList = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (service_id, uniqueId, index = 0) {
        let GalleryList = (0, _commonHelper.getCache)('galleryList');
        if (GalleryList !== null) {
            let singleServiceGalleryList = GalleryList.filter(function (data) {
                return data.service_id === service_id;
            });
            if (singleServiceGalleryList) {
                return singleServiceGalleryList;
            } else {
                if (index === 0) {
                    GalleryList = _Gallery2.default.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).exec();
                    (0, _commonHelper.setCache)('galleryList', GalleryList);
                    return getGalleryList(service_id, uniqueId, 1);
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, `[getGalleryList] : Record not found Service_Id = ${service_id}`, uniqueId);
                    return null;
                }
            }
        } else {
            GalleryList = yield _Gallery2.default.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).exec();
            (0, _commonHelper.setCache)('galleryList', GalleryList);
            return getGalleryList(service_id, uniqueId, 1);
        }
    });

    return function getGalleryList(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

// Gets all the Gallery


let allGallery = exports.allGallery = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (req, res) {
        if (req.params.serviceId) {
            const uniqueId = (0, _commonHelper.getGuid)();
            const galleryList = yield getGalleryList(req.params.serviceId, uniqueId);
            res.status(200).json(galleryList);
        }
    });

    return function allGallery(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})();

exports.deleteGallery = deleteGallery;
exports.addNewGallery = addNewGallery;
exports.updateGallery = updateGallery;

var _Gallery = require('./Gallery.model');

var _Gallery2 = _interopRequireDefault(_Gallery);

var _Service = require('../Service/Service.model');

var _Service2 = _interopRequireDefault(_Service);

var _commonHelper = require('../../config/commonHelper');

var _Log = require('../../config/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');function deleteGallery(req, res) {
    if (req.params.galleryId) {
        let galleryId = req.params.galleryId;
        _Gallery2.default.remove({ id: galleryId }).exec(function (err, DeleteGallery) {
            if (!err) {
                if (DeleteGallery) {
                    if (DeleteGallery.result.n === 1) {
                        (0, _commonHelper.setCache)('galleryList', null);
                        (0, _commonHelper.setCache)('galleryLists', null);
                        res.status(200).json({ id: galleryId, result: "Deleted Successfully" });
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)("Deleted Fail", "Deleted Fail"));
                    }
                } else {
                    res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid Post", "Invalid Post"));
                }
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
            }
        });
    } else {
        res.status(400).json((0, _commonHelper.errorJsonResponse)("Id is required", "Id is required"));
    }
}

function addNewGallery(req, res, next) {
    try {

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if ((0, _keys2.default)(files).length > 0 && fields.title && fields.description && fields.service_id && fields.sex && isImage(files.filetoupload.name)) {
                let uuid = (0, _commonHelper.getGuid)();
                let oldpath = files.filetoupload.path;
                let newpath = _commonHelper.GalleryImageUploadLocation.path + files.filetoupload.name;
                let dbpath = _commonHelper.GalleryImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = _commonHelper.GalleryImageUploadLocation.path + uuid + files.filetoupload.name;
                let service_id = fields.service_id;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let sex = fields.sex.toLowerCase();

                _Service2.default.findOne({ id: service_id }).exec(function (err, findService) {
                    if (findService) {
                        fs_extra.move(oldpath, newpath, function (err) {
                            if (err) {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                            } else {
                                fs.rename(newpath, renameFilePath, function (err) {
                                    if (err) {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                                    } else {
                                        let GalleryNewAdd = new _Gallery2.default({
                                            id: (0, _commonHelper.getGuid)(),
                                            service_id: service_id,
                                            image_url: dbpath,
                                            title: title,
                                            description: description,
                                            date: new Date().toISOString(),
                                            sex: sex
                                        });
                                        GalleryNewAdd.save().then(function (InsertService, err) {
                                            if (!err) {
                                                if (InsertService) {
                                                    (0, _commonHelper.setCache)('galleryList', null);
                                                    (0, _commonHelper.setCache)('galleryLists', null);
                                                    res.status(200).json({
                                                        data: InsertService,
                                                        result: "Save Successfully"
                                                    });
                                                } else {
                                                    res.status(400).json((0, _commonHelper.errorJsonResponse)("Error in db response", "Invalid_Image"));
                                                }
                                            } else {
                                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)("Service Not Found ", "Service Not Found"));
                    }
                });
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid Request", "Invalid Request"));
            }
        });
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), "Invalid Image"));
    }
}

function updateGallery(req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.title && fields.description && fields.service_id && fields.sex && fields.id) {

                if (files.filetoupload && isImage(files.filetoupload.name)) {
                    let uuid = (0, _commonHelper.getGuid)();
                    let oldpath = files.filetoupload.path;
                    let newpath = _commonHelper.GalleryImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = _commonHelper.GalleryImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = _commonHelper.GalleryImageUploadLocation.path + uuid + files.filetoupload.name;
                    let service_id = fields.service_id;
                    let id = fields.id;
                    let title = fields.title.toLowerCase();
                    let description = fields.description.toLowerCase();
                    let sex = fields.sex.toLowerCase();

                    let response = {
                        id,
                        service_id,
                        image_url: dbpath,
                        title,
                        description,
                        sex
                    };

                    _Service2.default.findOne({ id: service_id }).exec(function (err, findService) {
                        if (findService) {
                            fs_extra.move(oldpath, newpath, function (err) {
                                if (err) {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                                } else {
                                    fs.rename(newpath, renameFilePath, function (err) {
                                        if (err) {
                                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                                        } else {

                                            _Gallery2.default.update({ id: id }, {
                                                service_id: service_id,
                                                image_url: dbpath,
                                                title: title,
                                                description: description,
                                                date: new Date().toISOString(),
                                                sex: sex
                                            }).exec(function (err, UpdateGallery) {
                                                if (!err) {
                                                    if (UpdateGallery) {
                                                        if (UpdateGallery.nModified === 1 || UpdateGallery.n === 1) {
                                                            (0, _commonHelper.setCache)('galleryList', null);
                                                            (0, _commonHelper.setCache)('galleryLists', null);
                                                            res.status(200).json({
                                                                data: response,
                                                                result: "updated Successfully "
                                                            });
                                                        } else {
                                                            res.status(400).json((0, _commonHelper.errorJsonResponse)("Record not found", "Record not found"));
                                                        }
                                                    } else {
                                                        res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid_Image", "Invalid_Image"));
                                                    }
                                                } else {
                                                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)("Service Not Found ", "Service Not Found"));
                        }
                    });
                } else {

                    let service_id = fields.service_id;
                    let id = fields.id;
                    let title = fields.title.toLowerCase();
                    let description = fields.description.toLowerCase();
                    let sex = fields.sex.toLowerCase();

                    let response = {
                        id,
                        service_id,
                        title,
                        description,
                        sex
                    };

                    _Service2.default.findOne({ id: service_id }).exec(function (err, findService) {
                        if (findService) {
                            _Gallery2.default.update({ id: id }, {
                                service_id: service_id,
                                title: title,
                                description: description,
                                sex: sex
                            }).exec(function (err, UpdateGallery) {
                                if (!err) {
                                    if (UpdateGallery) {
                                        if (UpdateGallery.nModified === 1 || UpdateGallery.n === 1) {
                                            (0, _commonHelper.setCache)('galleryList', null);
                                            (0, _commonHelper.setCache)('galleryLists', null);
                                            res.status(200).json({
                                                data: response,
                                                result: "updated Successfully "
                                            });
                                        } else {
                                            res.status(400).json((0, _commonHelper.errorJsonResponse)("Record not found", "Record not found"));
                                        }
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid_Image", "Invalid_Image"));
                                    }
                                } else {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                                }
                            });
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)("Service Not Found ", "Service Not Found"));
                        }
                    });
                }
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid Request", "Invalid Request"));
            }
        });
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), "Invalid Image"));
    }
}
//# sourceMappingURL=Gallery.controller.js.map
