import Video from './Video.model';
import Service from '../Service/Service.model';
import {errorJsonResponse, getCache, getGuid, setCache} from '../../config/commonHelper';
import Oauth from '../oauth/oauth.model';
import TeamMemberProduct from '../TeamMemberProduct/TeamMemberProduct.model';
import Log from '../../config/Log';


async function getVideoList(service_id,uniqueId, index = 0) {
    let VideoList = getCache('videoList');
    if(VideoList !== null) {
        let singleServiceVideoList = VideoList.filter((data) => data.service_id === service_id);
        if(singleServiceVideoList) {
            return singleServiceVideoList;
        } else {
            if(index === 0) {
                VideoList = await Video.find({}, {_id: 0, __v: 0}).sort({date: -1}).exec();
                setCache('videoList', VideoList);
                return getVideoList(service_id,uniqueId, 1);
            } else {
                Log.writeLog(Log.eLogLevel.error, `[getVideoList] : Record not found Service_Id = ${service_id}`, uniqueId);
                return null;
            }
        }
    } else {
        VideoList = await Video.find({}, {_id: 0, __v: 0}).sort({date: -1}).exec();
        setCache('videoList', VideoList);
        return getVideoList(service_id,uniqueId, 1);
    }
}


// Gets all the Videos
export async function allVideos(req, res) {
    if (req.params.serviceId) {
        const uniqueId = getGuid();
        let videoList = await getVideoList(req.params.serviceId, uniqueId);
        res.status(200).json(videoList);
    }
}


export function deleteVideo(req, res) {
    if (req.params.videoId) {
        let videoId = req.params.videoId;
        Video.remove({id: videoId})
            .exec(function (err, DeleteVideo) {
                if (!err) {
                    if (DeleteVideo) {
                        if (DeleteVideo.result.n === 1) {
                            setCache('videoList', null);
                            res.status(200)
                                .json({id: videoId, result: "Deleted Successfully"});
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

export function addNewVideo(req, res, next) {
    try {

        let request = {
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        Service.findOne({id: request.service_id}).exec(function (err, findService) {
            if (findService) {
                let VideoNewAdd = new Video({
                    id: getGuid(),
                    service_id: request.service_id,
                    video_url: request.video_url,
                    title: request.title,
                    description: request.description,
                    date: new Date().toISOString(),
                    sex: request.sex
                });
                VideoNewAdd.save()
                    .then(function (InsertService, err) {
                        if (!err) {
                            if (InsertService) {
                                setCache('videoList', null);
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
            else {
                res.status(400)
                    .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), Error.toString()));
    }
}

export function updateGallery(req, res, next) {
    try {

        let request = {
            id: req.body.id,
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        Service.findOne({id: request.service_id}).exec(function (err, findService) {
            if (findService) {
                Video.update({id: request.id}, {
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
                                setCache('videoList', null);
                                res.status(200)
                                    .json({
                                        data: request,
                                        result: "updated Successfully "
                                    });

                            } else {
                                res.status(400)
                                    .json(errorJsonResponse("Record not found", "Record not found"));
                            }

                        } else {
                            res.status(400)
                                .json(errorJsonResponse(err, "Contact to your Developer"));
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
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), Error.toString()));
    }
}
