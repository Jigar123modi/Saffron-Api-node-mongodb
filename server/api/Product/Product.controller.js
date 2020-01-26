import Product from './Product.model';
import Service from '../Service/Service.model';
import TeamMemberProduct from '../TeamMemberProduct/TeamMemberProduct.model';
import {errorJsonResponse, ProductImageUploadLocation, getGuid, setCache, getCache} from '../../config/commonHelper';
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
}

// Home Product Page
export async function index(req, res) {
    let ProductsList = getCache('productsHomeLists');
    if(ProductsList !== null) {
        let response = {
            AllProducts: ProductsList
        };
        res.status(200).json(response);
    } else {
        Service.aggregate({"$unwind": "$id"},
            {
                "$lookup": {
                    "from": "products",
                    "localField": "id",
                    "foreignField": "service_id",
                    "as": "itemsObjects"
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "service_id": {"$first": "$id"},
                    "image_url": {"$first": "$image_url"},
                    "title": {"$first": "$title"},
                    "description": {"$first": "$description"},
                    "date": {"$first": "$date"},
                    "products": {"$first": "$itemsObjects"}
                }
            },
            {$sort: {date: 1}}).exec(async (error, ProductList) => {

            let i = 0;
            let result = await Promise.all(ProductList.map(async (Service) => {
                i++;
                return await Promise.all(Service.products.map(async (Product) => {
                    i++;
                    Product.teamMember = [];
                    let TeamMember = await TeamMemberProduct.find({product_id: Product.id}).exec();
                    return await Promise.all(TeamMember.map(async (team) => {
                        i++;
                        Product.teamMember.push(team.teamMember_id);
                        return i;
                    }));
                }));
            }));

            let response = {
                AllProducts: ProductList
            };

            setCache('productsHomeLists', ProductList);
            res.status(200).json(response);
        });
    }
}

// Gets a list of Products
export function allProduct(req, res) {
    return Product.aggregate({"$unwind": "$id"},
        {
            "$lookup": {
                "from": "services",
                "localField": "service_id",
                "foreignField": "id",
                "as": "itemsObjects"
            }
        }, {
            $unwind: "$itemsObjects"
        },
        {
            "$group": {
                "_id": "$_id",
                "id": {"$first": "$id"},
                "image_url": {"$first": "$image_url"},
                "title": {"$first": "$title"},
                "description": {"$first": "$description"},
                "date": {"$first": "$date"},
                "price": {"$first": "$price"},
                "offerPrice": {"$first": "$offerPrice"},
                "service_id": {"$first": "$service_id"},
                "sex": {"$first": "$sex"},
                "service_title": {"$first": "$itemsObjects.title"}
            }
        },
        {$sort: {date: 1}}).exec()
        .then(respondWithResult(res, 200))
        .catch(handleError(res));
}

export function addNewProduct(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        let reg = /^\d+$/;
        form.parse(req, function (err, fields, files) {
            if (Object.keys(files).length > 0 && fields.title && fields.description && fields.service_id && fields.sex && fields.price && fields.price.match(reg) && fields.offerPrice && fields.offerPrice.match(reg) && isImage(files.filetoupload.name)) {
                let uuid = getGuid();
                let oldpath = files.filetoupload.path;
                let newpath = ProductImageUploadLocation.path + files.filetoupload.name;
                let dbpath = ProductImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = ProductImageUploadLocation.path + uuid + files.filetoupload.name;
                let service_id = fields.service_id;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let sex = fields.sex.toLowerCase();
                let price = fields.price;
                let offerPrice = fields.offerPrice;

                Service.findOne({id: service_id}).exec(function (err, findService) {
                    // find the service.
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
                                        let ProductAdd = new Product({
                                            id: getGuid(),
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
                                        ProductAdd.save()
                                            .then(function (InsertService, err) {
                                                if (!err) {
                                                    if (InsertService) {
                                                        setCache('productsHomeLists',null);
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
        res.status(400).json(errorJsonResponse(Error.toString(), "Invalid Request"));
    }
}

export function updateProduct(req, res, next) {
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
                    let uuid = getGuid();
                    let oldpath = files.filetoupload.path;
                    let newpath = ProductImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = ProductImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = ProductImageUploadLocation.path + uuid + files.filetoupload.name;

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

                                            Product.update({id: id}, {
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
                                                            setCache('productsHomeLists',null);
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

                    let response = {
                        id,
                        service_id,
                        title,
                        description,
                        price,
                        offerPrice,
                        sex
                    };


                    Service.findOne({id: service_id}).exec(function (err, findService) {
                        if (findService) {
                            Product.update({id: id}, {
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
                                            setCache('productsHomeLists',null);
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

export function deleteProduct(req, res, next) {
    try {
        if (req.params.productId) {
            let productId = req.params.productId;

            //Remove All the product from TeamMember
            TeamMemberProduct.remove({product_id: productId}).exec((err, DeleteTeamMember) => {
                if (DeleteTeamMember) {
                    Product.remove({id: productId})
                        .exec(function (err, DeleteTeam) {
                            if (!err) {
                                if (DeleteTeam) {
                                    if (DeleteTeam.result.n === 1) {
                                        setCache('productsHomeLists',null);
                                        res.status(200)
                                            .json({id: productId, result: 'Deleted Successfully'});
                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse('Deleted Fail', 'Deleted Fail'));
                                    }
                                } else {
                                    res.status(400)
                                        .json(errorJsonResponse('Invalid Post', 'Invalid Post'));
                                }
                            } else {
                                res.status(400)
                                    .json(errorJsonResponse(err, 'Contact to your Developer'));
                            }
                        });
                }
            });
        } else {
            res.status(400)
                .json(errorJsonResponse('Id is required', 'Id is required'));
        }

    } catch (error) {
        res.status(400)
            .json(errorJsonResponse(error, 'Contact to your Developer'));
    }
}

export function teamMember(req, res, next) {
    try {
        if (req.params.productId) {
            let productId = req.params.productId;
            return Product.aggregate([
                {
                    $match: {id: productId}
                },
                {"$unwind": "$id"},
                {
                    "$lookup": {
                        "from": "teams",
                        "localField": "id",
                        "foreignField": "product_id",
                        "as": "TeamObjects"
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "id": {"$first": "$id"},
                        "title": {"$first": "$title"},
                        "teamsMember": {"$first": "$TeamObjects"}
                    }
                }
            ]).exec()
                .then(respondWithResult(res, 200))
                .catch(handleError(res));
        } else {
            res.status(400)
                .json(errorJsonResponse("Product Id is required", "Product Id is required"));
        }

    } catch (error) {
        res.status(400).json(errorJsonResponse(error, "Contact to your Developer"));
    }
}
