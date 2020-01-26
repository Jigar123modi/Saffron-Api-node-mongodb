'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.index = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Gets a list of Teams
let index = exports.index = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
        let teamList = (0, _commonHelper.getCache)('teamList');
        if (teamList !== null) {
            res.status(200).json(teamList);
        } else {
            teamList = yield _oauth2.default.find({ role: { $in: ['employee'] } }, { _id: 0, __v: 0, password: 0 }).exec();
            (0, _commonHelper.setCache)('teamList', teamList);
            res.status(200).json(teamList);
        }
    });

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

exports.deleteTeam = deleteTeam;
exports.addNewTeam = addNewTeam;
exports.updateTeam = updateTeam;

var _TeamMemberProduct = require('../TeamMemberProduct/TeamMemberProduct.model');

var _TeamMemberProduct2 = _interopRequireDefault(_TeamMemberProduct);

var _oauth = require('../oauth/oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');function deleteTeam(req, res, next) {
    try {
        if (req.params.teamId) {
            let teamId = req.params.teamId;

            //Remove all the TeamMemberProduct
            _TeamMemberProduct2.default.remove({ teamMember_id: teamId }).exec((err, deleteTeamMember) => {
                if (deleteTeamMember) {
                    _oauth2.default.remove({ id: teamId }).exec(function (err, DeleteTeam) {
                        if (!err) {
                            if (DeleteTeam) {
                                if (DeleteTeam.result.n === 1) {
                                    (0, _commonHelper.setCache)('teamList', null);
                                    res.status(200).json({ id: teamId, result: 'Deleted Successfully' });
                                } else {
                                    res.status(400).json({ result: 'Deleted Fail' });
                                }
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)('Invalid Post', 'Invalid Post'));
                            }
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                        }
                    });
                }
            });
        } else {
            res.status(400).json((0, _commonHelper.errorJsonResponse)('Id is required', 'Id is required'));
        }
    } catch (error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), 'Contact to your Developer'));
    }
}

function addNewTeam(req, res, next) {
    try {

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if ((0, _keys2.default)(files).length > 0 && fields.first_name && fields.description && fields.mobile_number && fields.last_name && isImage(files.filetoupload.name)) {

                let uuid = (0, _commonHelper.getGuid)();
                let oldpath = files.filetoupload.path;
                let newpath = _commonHelper.UserAvatarImageUploadLocation.path + files.filetoupload.name;
                let dbpath = _commonHelper.UserAvatarImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = _commonHelper.UserAvatarImageUploadLocation.path + uuid + files.filetoupload.name;
                let first_name = fields.first_name.toLowerCase();
                let last_name = fields.last_name.toLowerCase();
                let mobile_number = fields.mobile_number.toLowerCase();
                let description = fields.description.toLowerCase();
                let password = "saffron123";

                fs_extra.move(oldpath, newpath, function (err) {
                    if (err) {
                        res.status(500).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                    } else {
                        fs.rename(newpath, renameFilePath, function (err) {
                            if (err) {
                                res.status(500).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                            } else {

                                let alreadyAvailable = false;
                                //check mobile number is already register or not
                                _oauth2.default.findOne({ userId: mobile_number }).exec(function (err, findUser) {

                                    if (findUser) {
                                        alreadyAvailable = true;
                                    }

                                    if (!alreadyAvailable) {
                                        let registrationUser = new _oauth2.default({
                                            id: (0, _commonHelper.getGuid)(),
                                            first_name: first_name,
                                            last_name: last_name,
                                            description: description,
                                            contact_no: mobile_number,
                                            email_id: "",
                                            userId: mobile_number,
                                            password: password,
                                            role: "employee",
                                            block: false,
                                            image_url: dbpath
                                        });
                                        registrationUser.save().then(function (RegistrationSuccess, err) {
                                            if (!err) {
                                                if (RegistrationSuccess) {
                                                    (0, _commonHelper.setCache)('teamList', null);
                                                    res.status(200).json({
                                                        data: RegistrationSuccess,
                                                        result: "Registration Successfully for Team Member"
                                                    });
                                                } else {
                                                    res.status(400).json((0, _commonHelper.errorJsonResponse)("Error in db response", "Invalid_Image"));
                                                }
                                            } else {
                                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
                                            }
                                        });
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)("Mobile number is already register", "Mobile number is already register"));
                                    }
                                });
                            }
                        });
                    }
                });
            } else {

                let errorMessage = "";
                if ((0, _keys2.default)(files).length <= 0) {
                    errorMessage += "Team image is required.";
                } else if (!fields.first_name) {
                    errorMessage += "Team first name is required";
                } else if (!fields.last_name) {
                    errorMessage += "Team last name is required";
                } else if (!fields.mobile_number) {
                    errorMessage += "Team mobile number is required";
                } else if (!fields.password) {
                    errorMessage += "Team password is required";
                } else if (!fields.description) {
                    errorMessage += "Team description is required";
                } else {
                    if (!isImage(files.filetoupload.name)) {
                        errorMessage += "only image is allowed.";
                    }
                }
                res.status(400).json((0, _commonHelper.errorJsonResponse)(errorMessage, errorMessage));
            }
        });
    } catch (error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), "Invalid Image"));
    }
}

function updateTeam(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.first_name && fields.last_name && fields.description && fields.id) {

                if (files.filetoupload && isImage(files.filetoupload.name)) {

                    let uuid = (0, _commonHelper.getGuid)();
                    let id = fields.id;
                    let oldpath = files.filetoupload.path;
                    let newpath = _commonHelper.UserAvatarImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = _commonHelper.UserAvatarImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = _commonHelper.UserAvatarImageUploadLocation.path + uuid + files.filetoupload.name;
                    let first_name = fields.first_name.toLowerCase();
                    let last_name = fields.last_name.toLowerCase();
                    let description = fields.description.toLowerCase();

                    let TeamObject = {
                        id,
                        image_url: dbpath,
                        first_name,
                        last_name,
                        description
                    };

                    fs_extra.move(oldpath, newpath, function (err) {
                        if (err) {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                        } else {
                            fs.rename(newpath, renameFilePath, function (err) {
                                if (err) {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                                } else {

                                    _oauth2.default.update({ id: id }, {
                                        image_url: dbpath,
                                        first_name: first_name,
                                        last_name: last_name,
                                        description: description
                                    }).exec(function (err, UpdateTeam) {
                                        if (!err) {
                                            if (UpdateTeam) {
                                                if (UpdateTeam.nModified === 1 || UpdateTeam.n === 1) {
                                                    (0, _commonHelper.setCache)('teamList', null);
                                                    res.status(200).json({
                                                        data: TeamObject,
                                                        result: "updated Successfully "
                                                    });
                                                } else {
                                                    res.status(400).json((0, _commonHelper.errorJsonResponse)("not found", "not found"));
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

                    let description = fields.description.toLowerCase();
                    let first_name = fields.first_name.toLowerCase();
                    let last_name = fields.last_name.toLowerCase();
                    let id = fields.id;

                    let TeamObject = {
                        id,
                        first_name,
                        last_name,
                        description
                    };

                    _oauth2.default.update({ id: id }, {
                        first_name: first_name,
                        last_name: last_name,
                        description: description
                    }).exec(function (err, UpdateTeam) {
                        if (!err) {
                            if (UpdateTeam) {
                                if (UpdateTeam.nModified === 1 || UpdateTeam.n === 1) {
                                    (0, _commonHelper.setCache)('teamList', null);
                                    res.status(200).json({
                                        data: TeamObject,
                                        result: "updated Successfully "
                                    });
                                } else {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)("not found", "not found"));
                                }
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)("Invalid_Image", "Invalid_Image"));
                            }
                        } else {
                            res.status(400).json((0, _commonHelper.errorJsonResponse)(err, "Contact to your Developer"));
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
//# sourceMappingURL=Team.controller.js.map
