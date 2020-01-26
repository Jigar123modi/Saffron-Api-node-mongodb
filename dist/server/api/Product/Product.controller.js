'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.index = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Home Product Page
let index = exports.index = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
        let ProductsList = (0, _commonHelper.getCache)('productsHomeLists');
        if (ProductsList !== null) {
            let response = {
                AllProducts: ProductsList
            };
            res.status(200).json(response);
        } else {
            _Service2.default.aggregate({ "$unwind": "$id" }, {
                "$lookup": {
                    "from": "products",
                    "localField": "id",
                    "foreignField": "service_id",
                    "as": "itemsObjects"
                }
            }, {
                "$group": {
                    "_id": "$_id",
                    "service_id": { "$first": "$id" },
                    "image_url": { "$first": "$image_url" },
                    "title": { "$first": "$title" },
                    "description": { "$first": "$description" },
                    "date": { "$first": "$date" },
                    "products": { "$first": "$itemsObjects" }
                }
            }, { $sort: { date: 1 } }).exec((() => {
                var _ref2 = (0, _asyncToGenerator3.default)(function* (error, ProductList) {

                    let i = 0;
                    let result = yield _promise2.default.all(ProductList.map((() => {
                        var _ref3 = (0, _asyncToGenerator3.default)(function* (Service) {
                            i++;
                            return yield _promise2.default.all(Service.products.map((() => {
                                var _ref4 = (0, _asyncToGenerator3.default)(function* (Product) {
                                    i++;
                                    Product.teamMember = [];
                                    let TeamMember = yield _TeamMemberProduct2.default.find({ product_id: Product.id }).exec();
                                    return yield _promise2.default.all(TeamMember.map((() => {
                                        var _ref5 = (0, _asyncToGenerator3.default)(function* (team) {
                                            i++;
                                            Product.teamMember.push(team.teamMember_id);
                                            return i;
                                        });

                                        return function (_x7) {
                                            return _ref5.apply(this, arguments);
                                        };
                                    })()));
                                });

                                return function (_x6) {
                                    return _ref4.apply(this, arguments);
                                };
                            })()));
                        });

                        return function (_x5) {
                            return _ref3.apply(this, arguments);
                        };
                    })()));

                    let response = {
                        AllProducts: ProductList
                    };

                    (0, _commonHelper.setCache)('productsHomeLists', ProductList);
                    res.status(200).json(response);
                });

                return function (_x3, _x4) {
                    return _ref2.apply(this, arguments);
                };
            })());
        }
    });

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

// Gets a list of Products


exports.allProduct = allProduct;
exports.addNewProduct = addNewProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.teamMember = teamMember;

var _Product = require('./Product.model');

var _Product2 = _interopRequireDefault(_Product);

var _Service = require('../Service/Service.model');

var _Service2 = _interopRequireDefault(_Service);

var _TeamMemberProduct = require('../TeamMemberProduct/TeamMemberProduct.model');

var _TeamMemberProduct2 = _interopRequireDefault(_TeamMemberProduct);

var _commonHelper = require('../../config/commonHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}function allProduct(req, res) {
    return _Product2.default.aggregate({ "$unwind": "$id" }, {
        "$lookup": {
            "from": "services",
            "localField": "service_id",
            "foreignField": "id",
            "as": "itemsObjects"
        }
    }, {
        $unwind: "$itemsObjects"
    }, {
        "$group": {
            "_id": "$_id",
            "id": { "$first": "$id" },
            "image_url": { "$first": "$image_url" },
            "title": { "$first": "$title" },
            "description": { "$first": "$description" },
            "date": { "$first": "$date" },
            "price": { "$first": "$price" },
            "offerPrice": { "$first": "$offerPrice" },
            "service_id": { "$first": "$service_id" },
            "sex": { "$first": "$sex" },
            "service_title": { "$first": "$itemsObjects.title" }
        }
    }, { $sort: { date: 1 } }).exec().then(respondWithResult(res, 200)).catch(handleError(res));
}

function addNewProduct(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        let reg = /^\d+$/;
        form.parse(req, function (err, fields, files) {
            if ((0, _keys2.default)(files).length > 0 && fields.title && fields.description && fields.service_id && fields.sex && fields.price && fields.price.match(reg) && fields.offerPrice && fields.offerPrice.match(reg) && isImage(files.filetoupload.name)) {
                let uuid = (0, _commonHelper.getGuid)();
                let oldpath = files.filetoupload.path;
                let newpath = _commonHelper.ProductImageUploadLocation.path + files.filetoupload.name;
                let dbpath = _commonHelper.ProductImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = _commonHelper.ProductImageUploadLocation.path + uuid + files.filetoupload.name;
                let service_id = fields.service_id;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let sex = fields.sex.toLowerCase();
                let price = fields.price;
                let offerPrice = fields.offerPrice;

                _Service2.default.findOne({ id: service_id }).exec(function (err, findService) {
                    // find the service.
                    if (findService) {
                        fs_extra.move(oldpath, newpath, function (err) {
                            if (err) {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Same Name Image Already Available On Server"));
                            } else {
                                fs.rename(newpath, renameFilePath, function (err) {
                                    if (err) {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err.toString(), "Fail to Rename file"));
                                    } else {
                                        let ProductAdd = new _Product2.default({
                                            id: (0, _commonHelper.getGuid)(),
                                            service_id: service_id,
                                            price: price,
                                            offerPrice: offerPrice,
                                            image_url: dbpath,
                                            title: title,
                                            description: description,
                                            bookingValue: true,
                                            date: new Date().toISOString(),
                                            sex: sex
                                        });
                                        ProductAdd.save().then(function (InsertService, err) {
                                            if (!err) {
                                                if (InsertService) {
                                                    (0, _commonHelper.setCache)('productsHomeLists', null);
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
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), "Invalid Request"));
    }
}

function updateProduct(req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.title && fields.description && fields.service_id && fields.sex && fields.id && fields.offerPrice && fields.price) {

                let service_id = fields.service_id;
                let id = fields.id;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let sex = fields.sex.toLowerCase();
                let price = fields.price;
                let offerPrice = fields.offerPrice;

                if (files.filetoupload && isImage(files.filetoupload.name)) {
                    let uuid = (0, _commonHelper.getGuid)();
                    let oldpath = files.filetoupload.path;
                    let newpath = _commonHelper.ProductImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = _commonHelper.ProductImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = _commonHelper.ProductImageUploadLocation.path + uuid + files.filetoupload.name;

                    let response = {
                        id,
                        service_id,
                        image_url: dbpath,
                        title,
                        description,
                        price,
                        offerPrice,
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

                                            _Product2.default.update({ id: id }, {
                                                image_url: dbpath,
                                                service_id: response.service_id,
                                                price: response.price,
                                                offerPrice: response.offerPrice,
                                                title: response.title,
                                                description: response.description,
                                                sex: response.sex
                                            }).exec(function (err, UpdateProduct) {
                                                if (!err) {
                                                    if (UpdateProduct) {
                                                        if (UpdateProduct.nModified === 1 || UpdateProduct.n === 1) {
                                                            (0, _commonHelper.setCache)('productsHomeLists', null);
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

                    let response = {
                        id,
                        service_id,
                        title,
                        description,
                        price,
                        offerPrice,
                        sex
                    };

                    _Service2.default.findOne({ id: service_id }).exec(function (err, findService) {
                        if (findService) {
                            _Product2.default.update({ id: id }, {
                                service_id: response.service_id,
                                price: response.price,
                                offerPrice: response.offerPrice,
                                title: response.title,
                                description: response.description,
                                sex: response.sex
                            }).exec(function (err, UpdateProduct) {
                                if (!err) {
                                    if (UpdateProduct) {
                                        if (UpdateProduct.nModified === 1 || UpdateProduct.n === 1) {
                                            (0, _commonHelper.setCache)('productsHomeLists', null);
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

function deleteProduct(req, res, next) {
    try {
        if (req.params.productId) {
            let productId = req.params.productId;

            //Remove All the product from TeamMember
            _TeamMemberProduct2.default.remove({ product_id: productId }).exec((err, DeleteTeamMember) => {
                if (DeleteTeamMember) {
                    _Product2.default.remove({ id: productId }).exec(function (err, DeleteTeam) {
                        if (!err) {
                            if (DeleteTeam) {
                                if (DeleteTeam.result.n === 1) {
                                    (0, _commonHelper.setCache)('productsHomeLists', null);
                                    res.status(200).json({ id: productId, result: 'Deleted Successfully' });
                                } else {
                                    res.status(400).json((0, _commonHelper.errorJsonResponse)('Deleted Fail', 'Deleted Fail'));
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
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error, 'Contact to your Developer'));
    }
}

function teamMember(req, res, next) {
    try {
        if (req.params.productId) {
            let productId = req.params.productId;
            return _Product2.default.aggregate([{
                $match: { id: productId }
            }, { "$unwind": "$id" }, {
                "$lookup": {
                    "from": "teams",
                    "localField": "id",
                    "foreignField": "product_id",
                    "as": "TeamObjects"
                }
            }, {
                "$group": {
                    "_id": "$_id",
                    "id": { "$first": "$id" },
                    "title": { "$first": "$title" },
                    "teamsMember": { "$first": "$TeamObjects" }
                }
            }]).exec().then(respondWithResult(res, 200)).catch(handleError(res));
        } else {
            res.status(400).json((0, _commonHelper.errorJsonResponse)("Product Id is required", "Product Id is required"));
        }
    } catch (error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error, "Contact to your Developer"));
    }
}
//# sourceMappingURL=Product.controller.js.map
