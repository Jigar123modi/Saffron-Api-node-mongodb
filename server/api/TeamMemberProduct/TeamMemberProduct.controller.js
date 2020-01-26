import TeamMemberProduct from './TeamMemberProduct.model';
import {errorJsonResponse, getGuid, setCache} from '../../config/commonHelper';
import Product from '../Product/Product.model';
import Oauth from '../oauth/oauth.model';

export function addTeamProduct(req, res, next) {
    try {
        if(req.body) {

            let id = req.body.id;
            let product_id = req.body.product_id;
            let approxTime = req.body.approxTime;

            let TeamObject = {
                id,
                product_id,
                approxTime
            };

            try {
                Product.findOne({id: product_id})
                    .exec(function(err, findProduct) {

                        if(findProduct) {

                            Oauth.findOne({id: id, role: {$in: ['admin', 'employee']}})
                                .exec((err, findTeamMember) => {

                                    if(findTeamMember) {

                                        let TeamMemberProductAdd = new TeamMemberProduct({
                                            id: getGuid(),
                                            teamMember_id: TeamObject.id,
                                            product_id: TeamObject.product_id,
                                            approxTime: TeamObject.approxTime,
                                        });

                                        TeamMemberProductAdd.save()
                                            .then(function(InsertTeamMemberProductAdd, err) {
                                                if(!err) {
                                                    if(InsertTeamMemberProductAdd) {
                                                        setCache('productsHomeLists',null);
                                                        setCache('teamMemberProductList', null);
                                                        res.status(200)
                                                            .json({
                                                                data: InsertTeamMemberProductAdd,
                                                                result: 'Successfully Add new product'
                                                            });
                                                    } else {
                                                        res.status(400)
                                                            .json(errorJsonResponse('Error in db response', 'Invalid_Image'));
                                                    }
                                                } else {
                                                    res.status(400)
                                                        .json(errorJsonResponse(err, 'Contact to your Developer'));
                                                }
                                            });

                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse('TeamMember is not found', 'TeamMember is not found'));
                                    }
                                });
                        }
                        else {
                            res.status(400)
                                .json(errorJsonResponse('Product is not found', 'Product is not found'));
                        }
                    });
            }
            catch
                (error) {
                res.status(400)
                    .json(errorJsonResponse(error, 'contact to developer'));
            }
        }
    }
    catch(Error) {
        res.status(400)
            .json(errorJsonResponse(Error.toString(), 'Invalid Request'));
    }
}

export function removeTeamProduct(req, res, next) {
    try {
        if(req.body) {

            let id = req.body.id;
            let product_id = req.body.product_id;
            let TeamObject = {
                id,
                product_id
            };

            try {
                Product.find({id: product_id})
                    .exec(function(err, findService) {
                        if(findService.length > 0) {
                            TeamMemberProduct.remove({teamMember_id: TeamObject.id, product_id: TeamObject.product_id})
                                .exec(function(err, DeleteTeamMember) {
                                    if(!err) {
                                        if(DeleteTeamMember) {
                                            if(DeleteTeamMember.result.n === 1) {
                                                setCache('productsHomeLists',null);
                                                setCache('teamMemberProductList', null);
                                                res.status(200)
                                                    .json({
                                                        data: TeamObject,
                                                        result: 'Successfully Remove Product'
                                                    });
                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse('service not found', 'service not found'));
                                            }
                                        }
                                    }
                                });
                        }
                        else {
                            res.status(403)
                                .json(errorJsonResponse('Product is not found', 'Product is not found'));
                        }
                    });
            }
            catch
                (error) {
                res.status(501)
                    .json(errorJsonResponse(error, 'contact to developer'));
            }
        }
    }
    catch(Error) {
        res.status(400)
            .json(errorJsonResponse(Error.toString(), 'Invalid Request'));
    }
}

export function teamMemberProductsList(req, res, next) {
    try {
        if(req.params.teamMemberId) {

            let teamMemberId = req.params.teamMemberId;
            TeamMemberProduct.find({teamMember_id: teamMemberId})
                .exec((err, listTeamMemberProduct) => {
                    if(!err) {

                        let productList = [];
                        let productListWithTime = [];

                        listTeamMemberProduct.map((teamMemberProduct) => {
                            productList.push(teamMemberProduct.product_id);
                            productListWithTime.push({id: teamMemberProduct.product_id, approxTime: teamMemberProduct.approxTime});
                        });

                        return Product.find({
                            id: {
                                $in: productList
                            }
                        })
                            .exec(function(err, product) {

                                let response = [];
                                product.map((singleProduct) => {
                                    const getApproxTime = productListWithTime.find((data) => data.id === singleProduct.id);
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
                                        __v: 0,
                                    };

                                    response.push(singleProductObj);
                                });

                                res.status(200)
                                    .json(response);

                            });

                    } else {
                        res.status(400)
                            .json(errorJsonResponse(err, 'Contact to your Developer'));
                    }
                });
        } else {
            res.status(400)
                .json(errorJsonResponse('Team Member Id is required', 'Team Member Id is required'));
        }
    } catch(error) {
        res.status(400)
            .json(errorJsonResponse(error, 'Contact to your Developer'));
    }
}
