import Gallery from './Gallery.model';
import Service from '../Service/Service.model';
import {errorJsonResponse, GalleryImageUploadLocation, getCache, getGuid, setCache} from '../../config/commonHelper';
import Log from '../../config/Log';

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');


// Gets a list of Gallery
export async function index(req, res) {
    let GalleryList = getCache('galleryLists');
    if(GalleryList !== null) {
        res.status(200).json(GalleryList);
    } else {
        GalleryList = await Gallery.find({}, {_id: 0, __v: 0}).sort({date: -1}).limit(8).exec();
        setCache('galleryLists', GalleryList);
        res.status(200).json(GalleryList);
    }
}

async function getGalleryList(service_id, uniqueId, index = 0) {
    let GalleryList = getCache('galleryList');
    if(GalleryList !== null) {
        let singleServiceGalleryList = GalleryList.filter((data) => data.service_id === service_id);
        if(singleServiceGalleryList) {
            return singleServiceGalleryList;
        } else {
            if(index === 0) {
                GalleryList = Gallery.find({}, {_id: 0, __v: 0}).sort({date: -1}).exec();
                setCache('galleryList', GalleryList);
                return getGalleryList(service_id,uniqueId, 1);
            } else {
                Log.writeLog(Log.eLogLevel.error, `[getGalleryList] : Record not found Service_Id = ${service_id}`, uniqueId);
                return null;
            }
        }
    } else {
        GalleryList = await Gallery.find({}, {_id: 0, __v: 0}).sort({date: -1}).exec();
        setCache('galleryList', GalleryList);
        return getGalleryList(service_id,uniqueId, 1);
    }
}


// Gets all the Gallery
export async function allGallery(req, res) {
    if(req.params.serviceId) {
        const uniqueId = getGuid();
        const galleryList = await getGalleryList(req.params.serviceId, uniqueId);
        res.status(200).json(galleryList);
    }
}


export function deleteGallery(req, res) {
    if (req.params.galleryId) {
        let galleryId = req.params.galleryId;
        Gallery.remove({id: galleryId})
            .exec(function (err, DeleteGallery) {
                if (!err) {
                    if (DeleteGallery) {
                        if (DeleteGallery.result.n === 1) {
                            setCache('galleryList', null);
                            setCache('galleryLists', null);
                            res.status(200)
                                .json({id: galleryId, result: "Deleted Successfully"});
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

export function addNewGallery(req, res, next) {
    try {

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (Object.keys(files).length > 0 && fields.title && fields.description && fields.service_id && fields.sex && isImage(files.filetoupload.name)) {
                let uuid = getGuid();
                let oldpath = files.filetoupload.path;
                let newpath = GalleryImageUploadLocation.path + files.filetoupload.name;
                let dbpath = GalleryImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = GalleryImageUploadLocation.path + uuid + files.filetoupload.name;
                let service_id = fields.service_id;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let sex = fields.sex.toLowerCase();

                Service.findOne({id: service_id}).exec(function (err, findService) {
                    if (findService) {
                        fs_extra.move(oldpath, newpath, function (err) {
                            if (err) {
                                res.status(400)
                                    .json(errorJsonResponse(err.toString(), "Same Name Image Already Available On Server"));
                            } else {
                                fs.rename(newpath, renameFilePath, function (err) {
                                    if (err) {
                                        res.status(400).json(errorJsonResponse(err.toString(), "Fail to Rename file"));
                                    } else {
                                        let GalleryNewAdd = new Gallery({
                                            id: getGuid(),
                                            service_id: service_id,
                                            image_url: dbpath,
                                            title: title,
                                            description: description,
                                            date: new Date().toISOString(),
                                            sex: sex
                                        });
                                        GalleryNewAdd.save()
                                            .then(function (InsertService, err) {
                                                if (!err) {
                                                    if (InsertService) {
                                                        setCache('galleryList', null);
                                                        setCache('galleryLists', null);
                                                        res.status(200)
                                                            .json({
                                                                data: InsertService,
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
                        res.status(400)
                            .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
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

export function updateGallery(req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.title && fields.description && fields.service_id && fields.sex && fields.id) {

                if (files.filetoupload && isImage(files.filetoupload.name)) {
                    let uuid = getGuid();
                    let oldpath = files.filetoupload.path;
                    let newpath = GalleryImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = GalleryImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = GalleryImageUploadLocation.path + uuid + files.filetoupload.name;
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

                    Service.findOne({id: service_id}).exec(function (err, findService) {
                        if (findService) {
                            fs_extra.move(oldpath, newpath, function (err) {
                                if (err) {
                                    res.status(400)
                                        .json(errorJsonResponse(err.toString(), "Same Name Image Already Available On Server"));
                                } else {
                                    fs.rename(newpath, renameFilePath, function (err) {
                                        if (err) {
                                            res.status(400).json(errorJsonResponse(err.toString(), "Fail to Rename file"));
                                        } else {

                                            Gallery.update({id: id}, {
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
                                                            setCache('galleryList', null);
                                                            setCache('galleryLists', null);
                                                            res.status(200)
                                                                .json({
                                                                    data: response,
                                                                    result: "updated Successfully "
                                                                });

                                                        } else {
                                                            res.status(400)
                                                                .json(errorJsonResponse("Record not found", "Record not found"));
                                                        }

                                                    } else {
                                                        res.status(400)
                                                            .json(errorJsonResponse("Invalid_Image", "Invalid_Image"));
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
                            res.status(400)
                                .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
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


                    Service.findOne({id: service_id}).exec(function (err, findService) {
                        if (findService) {
                            Gallery.update({id: id}, {
                                service_id: service_id,
                                title: title,
                                description: description,
                                sex: sex
                            }).exec(function (err, UpdateGallery) {
                                if (!err) {
                                    if (UpdateGallery) {
                                        if (UpdateGallery.nModified === 1 || UpdateGallery.n === 1) {
                                            setCache('galleryList', null);
                                            setCache('galleryLists', null);
                                            res.status(200)
                                                .json({
                                                    data: response,
                                                    result: "updated Successfully "
                                                });

                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse("Record not found", "Record not found"));
                                        }
                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse("Invalid_Image", "Invalid_Image"));
                                    }
                                } else {
                                    res.status(400)
                                        .json(errorJsonResponse(err, "Contact to your Developer"));
                                }
                            });
                        } else {
                            res.status(400)
                                .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
                        }
                    });
                }
            } else {
                res.status(400).json(errorJsonResponse("Invalid Request", "Invalid Request"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), "Invalid Image"));
    }
}
