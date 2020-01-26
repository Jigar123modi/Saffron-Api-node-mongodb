'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.allVideos = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getVideoList = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (service_id, uniqueId, index = 0) {
        let VideoList = (0, _commonHelper.getCache)('videoList');
        if (VideoList !== null) {
            let singleServiceVideoList = VideoList.filter(function (data) {
                return data.service_id === service_id;
            });
            if (singleServiceVideoList) {
                return singleServiceVideoList;
            } else {
                if (index === 0) {
                    VideoList = yield _Video2.default.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).exec();
                    (0, _commonHelper.setCache)('videoList', VideoList);
                    return getVideoList(service_id, uniqueId, 1);
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, `[getVideoList] : Record not found Service_Id = ${service_id}`, uniqueId);
                    return null;
                }
            }
        } else {
            VideoList = yield _Video2.default.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).exec();
            (0, _commonHelper.setCache)('videoList', VideoList);
            return getVideoList(service_id, uniqueId, 1);
        }
    });

    return function getVideoList(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

// Gets all the Videos


let allVideos = exports.allVideos = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (req, res) {
        if (req.params.serviceId) {
            const uniqueId = (0, _commonHelper.getGuid)();
            let videoList = yield getVideoList(req.params.serviceId, uniqueId);
            res.status(200).json(videoList);
        }
    });

    return function allVideos(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

exports.deleteVideo = deleteVideo;
exports.addNewVideo = addNewVideo;
exports.updateGallery = updateGallery;

var _Video = require('./Video.model');

var _Video2 = _interopRequireDefault(_Video);

var _Service = require('../Service/Service.model');

var _Service2 = _interopRequireDefault(_Service);

var _commonHelper = require('../../config/commonHelper');

var _oauth = require('../oauth/oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

var _TeamMemberProduct = require('../TeamMemberProduct/TeamMemberProduct.model');

var _TeamMemberProduct2 = _interopRequireDefault(_TeamMemberProduct);

var _Log = require('../../config/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deleteVideo(req, res) {
    if (req.params.videoId) {
        let videoId = req.params.videoId;
        _Video2.default.remove({ id: videoId }).exec(function (err, DeleteVideo) {
            if (!err) {
                if (DeleteVideo) {
                    if (DeleteVideo.result.n === 1) {
                        (0, _commonHelper.setCache)('videoList', null);
                        res.status(200).json({ id: videoId, result: "Deleted Successfully" });
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

function addNewVideo(req, res, next) {
    try {

        let request = {
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        _Service2.default.findOne({ id: request.service_id }).exec(function (err, findService) {
            if (findService) {
                let VideoNewAdd = new _Video2.default({
                    id: (0, _commonHelper.getGuid)(),
                    service_id: request.service_id,
                    video_url: request.video_url,
                    title: request.title,
                    description: request.description,
                    date: new Date().toISOString(),
                    sex: request.sex
                });
                VideoNewAdd.save().then(function (InsertService, err) {
                    if (!err) {
                        if (InsertService) {
                            (0, _commonHelper.setCache)('videoList', null);
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
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)("Service Not Found ", "Service Not Found"));
            }
        });
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), Error.toString()));
    }
}

function updateGallery(req, res, next) {
    try {

        let request = {
            id: req.body.id,
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        _Service2.default.findOne({ id: request.service_id }).exec(function (err, findService) {
            if (findService) {
                _Video2.default.update({ id: request.id }, {
                    service_id: request.service_id,
                    image_url: request.dbpath,
                    title: request.title,
                    description: request.description,
                    date: new Date().toISOString(),
                    sex: request.sex
                }).exec(function (err, UpdateVideo) {
                    if (!err) {
                        if (UpdateVideo) {
                            if (UpdateVideo.nModified === 1 || UpdateVideo.n === 1) {
                                (0, _commonHelper.setCache)('videoList', null);
                                res.status(200).json({
                                    data: request,
                                    result: "updated Successfully "
                                });
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)("Record not found", "Record not found"));
                            }
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                        }
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                    }
                });
            } else {
                res.status(400).json((0, _commonHelper.errorJsonResponse)("Service Not Found ", "Service Not Found"));
            }
        });
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), Error.toString()));
    }
}
//# sourceMappingURL=Video.controller.js.map
