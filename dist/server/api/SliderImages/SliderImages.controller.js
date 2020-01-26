'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.index = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Gets a list of SliderImages
let index = exports.index = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
        let SliderList = (0, _commonHelper.getCache)('sliderLists');
        if (SliderList !== null) {
            res.status(200).json(SliderList);
        } else {
            SliderList = yield _SliderImages2.default.find().exec();
            (0, _commonHelper.setCache)('sliderLists', SliderList);
            res.status(200).json(SliderList);
        }
    });

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

// Add New SliderImagess


exports.addNewSliderImage = addNewSliderImage;
exports.deleteSliderImage = deleteSliderImage;

var _SliderImages = require('./SliderImages.model');

var _SliderImages2 = _interopRequireDefault(_SliderImages);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');function addNewSliderImage(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if ((0, _keys2.default)(files).length > 0 && isImage(files.filetoupload.name)) {
                let uuid = (0, _commonHelper.getGuid)();
                let oldpath = files.filetoupload.path;
                let newpath = _commonHelper.SliderImageUploadLocation.path + files.filetoupload.name;
                let dbpath = _commonHelper.SliderImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = _commonHelper.SliderImageUploadLocation.path + uuid + files.filetoupload.name;

                fs_extra.move(oldpath, newpath, function (err) {
                    if (err) {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                    } else {
                        fs.rename(newpath, renameFilePath, function (err) {
                            if (err) {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                            } else {
                                let SliderImageNewAdd = new _SliderImages2.default({
                                    id: (0, _commonHelper.getGuid)(),
                                    image_url: dbpath
                                });
                                SliderImageNewAdd.save().then(function (InsertSlider, err) {
                                    if (!err) {
                                        if (InsertSlider) {
                                            (0, _commonHelper.setCache)('sliderLists', null);
                                            res.status(200).json({
                                                data: InsertSlider,
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
                res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid Request", "Invalid Request"));
            }
        });
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), "Invalid Image"));
    }
}

function deleteSliderImage(req, res) {
    if (req.params.sliderImageId) {
        let sliderImageId = req.params.sliderImageId;
        _SliderImages2.default.remove({ id: sliderImageId }).exec(function (err, DeleteSliderImage) {
            if (!err) {
                if (DeleteSliderImage) {
                    if (DeleteSliderImage.result.n === 1) {
                        (0, _commonHelper.setCache)('sliderLists', null);
                        res.status(200).json({ id: sliderImageId, result: "Deleted Successfully" });
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
//# sourceMappingURL=SliderImages.controller.js.map
