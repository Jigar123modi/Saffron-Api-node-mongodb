import SliderImages from './SliderImages.model';
import {errorJsonResponse, SliderImageUploadLocation, getGuid, setCache, getCache} from '../../config/commonHelper';

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');

// Gets a list of SliderImages
export async function index(req, res) {
    let SliderList = getCache('sliderLists');
    if(SliderList !== null) {
        res.status(200).json(SliderList);
    } else {
        SliderList = await SliderImages.find().exec();
        setCache('sliderLists', SliderList);
        res.status(200).json(SliderList);
    }
}

// Add New SliderImagess
export function addNewSliderImage(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (Object.keys(files).length > 0 && isImage(files.filetoupload.name)) {
                let uuid = getGuid();
                let oldpath = files.filetoupload.path;
                let newpath = SliderImageUploadLocation.path + files.filetoupload.name;
                let dbpath = SliderImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = SliderImageUploadLocation.path + uuid + files.filetoupload.name;

                fs_extra.move(oldpath, newpath, function (err) {
                    if (err) {
                        res.status(400)
                            .json(errorJsonResponse(err.toString(), "Same Name Image Already Available On Server"));
                    } else {
                        fs.rename(newpath, renameFilePath, function (err) {
                            if (err) {
                                res.status(400).json(errorJsonResponse(err.toString(), "Fail to Rename file"));
                            } else {
                                let SliderImageNewAdd = new SliderImages({
                                    id: getGuid(),
                                    image_url: dbpath
                                });
                                SliderImageNewAdd.save()
                                    .then(function (InsertSlider, err) {
                                        if (!err) {
                                            if (InsertSlider) {
                                                setCache('sliderLists',null);
                                                res.status(200)
                                                    .json({
                                                        data: InsertSlider,
                                                        result: "Save Successfully"
                                                    });
                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse("Error in db response", "Invalid_Image"));
                                            }
                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse(err, "Contact to your Developer"));
                                        }
                                    });
                            }
                        });
                    }
                });

            } else {
                res.status(400).json(errorJsonResponse("Invalid Request", "Invalid Request"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), "Invalid Image"));
    }
}

export function deleteSliderImage(req, res) {
    if (req.params.sliderImageId) {
        let sliderImageId = req.params.sliderImageId;
        SliderImages.remove({id: sliderImageId})
            .exec(function (err, DeleteSliderImage) {
                if (!err) {
                    if (DeleteSliderImage) {
                        if (DeleteSliderImage.result.n === 1) {
                            setCache('sliderLists',null);
                            res.status(200)
                                .json({id: sliderImageId, result: "Deleted Successfully"});
                        } else {
                            res.status(400)
                                .json(errorJsonResponse("Deleted Fail", "Deleted Fail"));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse("Invalid Post", "Invalid Post"));
                    }
                } else {
                    res.status(400)
                        .json(errorJsonResponse(err, "Contact to your Developer"));
                }
            });
    } else {
        res.status(400)
            .json(errorJsonResponse("Id is required", "Id is required"));
    }
}
