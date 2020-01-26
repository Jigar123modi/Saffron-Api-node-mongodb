'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addTeamProduct = addTeamProduct;
exports.removeTeamProduct = removeTeamProduct;
exports.teamMemberProductsList = teamMemberProductsList;

var _TeamMemberProduct = require('./TeamMemberProduct.model');

var _TeamMemberProduct2 = _interopRequireDefault(_TeamMemberProduct);

var _commonHelper = require('../../config/commonHelper');

var _Product = require('../Product/Product.model');

var _Product2 = _interopRequireDefault(_Product);

var _oauth = require('../oauth/oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTeamProduct(req, res, next) {
    try {
        if (req.body) {

            let id = req.body.id;
            let product_id = req.body.product_id;
            let approxTime = req.body.approxTime;

            let TeamObject = {
                id,
                product_id,
                approxTime
            };

            try {
                _Product2.default.findOne({ id: product_id }).exec(function (err, findProduct) {

                    if (findProduct) {

                        _oauth2.default.findOne({ id: id, role: { $in: ['admin', 'employee'] } }).exec((err, findTeamMember) => {

                            if (findTeamMember) {

                                let TeamMemberProductAdd = new _TeamMemberProduct2.default({
                                    id: (0, _commonHelper.getGuid)(),
                                    teamMember_id: TeamObject.id,
                                    product_id: TeamObject.product_id,
                                    approxTime: TeamObject.approxTime
                                });

                                TeamMemberProductAdd.save().then(function (InsertTeamMemberProductAdd, err) {
                                    if (!err) {
                                        if (InsertTeamMemberProductAdd) {
                                            (0, _commonHelper.setCache)('productsHomeLists', null);
                                            (0, _commonHelper.setCache)('teamMemberProductList', null);
                                            res.status(200).json({
                                                data: InsertTeamMemberProductAdd,
                                                result: 'Successfully Add new product'
                                            });
                                        } else {
                                            res.status(400).json((0, _commonHelper.errorJsonResponse)('Error in db response', 'Invalid_Image'));
                                        }
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                                    }
                                });
                            } else {
                                res.status(400).json((0, _commonHelper.errorJsonResponse)('TeamMember is not found', 'TeamMember is not found'));
                            }
                        });
                    } else {
                        res.status(400).json((0, _commonHelper.errorJsonResponse)('Product is not found', 'Product is not found'));
                    }
                });
            } catch (error) {
                res.status(400).json((0, _commonHelper.errorJsonResponse)(error, 'contact to developer'));
            }
        }
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), 'Invalid Request'));
    }
}

function removeTeamProduct(req, res, next) {
    try {
        if (req.body) {

            let id = req.body.id;
            let product_id = req.body.product_id;
            let TeamObject = {
                id,
                product_id
            };

            try {
                _Product2.default.find({ id: product_id }).exec(function (err, findService) {
                    if (findService.length > 0) {
                        _TeamMemberProduct2.default.remove({ teamMember_id: TeamObject.id, product_id: TeamObject.product_id }).exec(function (err, DeleteTeamMember) {
                            if (!err) {
                                if (DeleteTeamMember) {
                                    if (DeleteTeamMember.result.n === 1) {
                                        (0, _commonHelper.setCache)('productsHomeLists', null);
                                        (0, _commonHelper.setCache)('teamMemberProductList', null);
                                        res.status(200).json({
                                            data: TeamObject,
                                            result: 'Successfully Remove Product'
                                        });
                                    } else {
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)('service not found', 'service not found'));
                                    }
                                }
                            }
                        });
                    } else {
                        res.status(403).json((0, _commonHelper.errorJsonResponse)('Product is not found', 'Product is not found'));
                    }
                });
            } catch (error) {
                res.status(501).json((0, _commonHelper.errorJsonResponse)(error, 'contact to developer'));
            }
        }
    } catch (Error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(Error.toString(), 'Invalid Request'));
    }
}

function teamMemberProductsList(req, res, next) {
    try {
        if (req.params.teamMemberId) {

            let teamMemberId = req.params.teamMemberId;
            _TeamMemberProduct2.default.find({ teamMember_id: teamMemberId }).exec((err, listTeamMemberProduct) => {
                if (!err) {

                    let productList = [];
                    let productListWithTime = [];

                    listTeamMemberProduct.map(teamMemberProduct => {
                        productList.push(teamMemberProduct.product_id);
                        productListWithTime.push({ id: teamMemberProduct.product_id, approxTime: teamMemberProduct.approxTime });
                    });

                    return _Product2.default.find({
                        id: {
                            $in: productList
                        }
                    }).exec(function (err, product) {

                        let response = [];
                        product.map(singleProduct => {
                            const getApproxTime = productListWithTime.find(data => data.id === singleProduct.id);
                            const singleProductObj = {
                                _id: singleProduct._id,
                                id: singleProduct.id,
                                service_id: singleProduct.service_id,
                                price: singleProduct.price,
                                offerPrice: singleProduct.offerPrice,
                                image_url: singleProduct.image_url,
                                title: singleProduct.title,
                                description: singleProduct.description,
                                bookingValue: singleProduct.bookingValue,
                                date: singleProduct.date,
                                sex: singleProduct.sex,
                                approxTime: getApproxTime.approxTime,
                                __v: 0
                            };

                            response.push(singleProductObj);
                        });

                        res.status(200).json(response);
                    });
                } else {
                    res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                }
            });
        } else {
            res.status(400).json((0, _commonHelper.errorJsonResponse)('Team Member Id is required', 'Team Member Id is required'));
        }
    } catch (error) {
        res.status(400).json((0, _commonHelper.errorJsonResponse)(error, 'Contact to your Developer'));
    }
}
//# sourceMappingURL=TeamMemberProduct.controller.js.map
