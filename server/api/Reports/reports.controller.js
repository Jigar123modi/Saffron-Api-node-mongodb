import Oauth from '../oauth/oauth.model';
import Booking from '../Booking/Booking.model';
import {errorJsonResponse, getGuid} from '../../config/commonHelper';
import Log from '../../config/Log';

export async function getTopUser(req, res, next) {
    let uniqueId = getGuid();
    try {
        let getAllUser = await Oauth.find({}, {
            _id: 0,
            __v: 0,
            description: 0,
            password: 0,
            role: 0,
            block: 0,
        }).exec();
        let allTopUserId = [];
        await Promise.all(getAllUser.map(async (data) => {
            const getAllBookingCountTopUser = await Booking.count({customer_id: {$in: data.contact_no}}).exec();
            const tmp = {user: data, totalOrder: getAllBookingCountTopUser};
            allTopUserId.push(tmp);
        }));
        for (let i = 0; i < allTopUserId.length; i++) {
            for (let j = 0; j < allTopUserId.length; j++) {
                if (allTopUserId[i].totalOrder > allTopUserId[j].totalOrder) {
                    const tmp = allTopUserId[i];
                    allTopUserId[i] = allTopUserId[j];
                    allTopUserId[j] = tmp;
                }
            }
        }
        res.status(200).json(allTopUserId);

    } catch (error) {
        Log.writeLog(Log.eLogLevel.error, '[getTopUser] : ' + JSON.stringify(errorJsonResponse(error.message.toString(), error.message.toString())), uniqueId);
        next(error);
    }
}

export async function getTotalBillablePrice(req, res, next) {
    let uniqueId = getGuid();
    try {
        let getAllUser = await Oauth.find({role: 'employee'}, {
            _id: 0,
            __v: 0,
            description: 0,
            password: 0,
            role: 0,
            block: 0,
        }).exec();
        let allEmployee = [];
        await Promise.all(getAllUser.map(async (data) => {
            const getAllBookingOrder = await Booking.find({"teamWiseProductList.id": data.id});
            let total = 0;
            getAllBookingOrder.map((innerData) => {
                let productList = innerData.teamWiseProductList.find((teamWise) => teamWise.id === data.id).productList;
                productList.map((singleProduct) => {
                    total += singleProduct.price;
                })
            });
            const tmp = {user: data, totalBillablePrice: total};
            allEmployee.push(tmp);
        }));

        res.status(200).json(allEmployee);

    } catch (error) {
        Log.writeLog(Log.eLogLevel.error, '[getTotalBillablePrice] : ' + JSON.stringify(errorJsonResponse(error.message.toString(), error.message.toString())), uniqueId);
        next(error);
    }
}

export async function getOrderStatusReport(req, res, next) {
    let uniqueId = getGuid();
    try {
        let response = [];
        let count = await Booking.count({status: "recent"}).exec();
        response.push({status: 'recent', total: count});
        count = await Booking.count({status: "process"}).exec();
        response.push({status: 'process', total: count});
        count = await Booking.count({status: "late"}).exec();
        response.push({status: 'late', total: count});
        count = await Booking.count({status: "finish"}).exec();
        response.push({status: 'finish', total: count});
        res.status(200).json(response);
    } catch (error) {
        Log.writeLog(Log.eLogLevel.error, '[getOrderStatusReport] : ' + JSON.stringify(errorJsonResponse(error.message.toString(), error.message.toString())), uniqueId);
        next(error);
    }
}

export async function getTeamWiseOrderStatusReport(req, res, next) {
    let uniqueId = getGuid();
    try {
        let response = [];

        let getAllUser = await Oauth.find({role: 'employee'}, {
            _id: 0,
            __v: 0,
            description: 0,
            password: 0,
            role: 0,
            block: 0,
        }).exec();

        await Promise.all(getAllUser.map(async (data) => {
            let tmp = {user: data, orderStatus: []};
            let count = await Booking.count({"teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus":"waiting"}).exec();
            tmp.orderStatus.push({status: 'waiting', total: count});
            count = await Booking.count({"teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus":"process"}).exec();
            tmp.orderStatus.push({status: 'process', total: count});
            count = await Booking.count({"teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus":"late"}).exec();
            tmp.orderStatus.push({status: 'late', total: count});
            count = await Booking.count({"teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus":"finish"}).exec();
            tmp.orderStatus.push({status: 'finish', total: count});
            response.push(tmp);
        }));
        res.status(200).json(response);

    } catch (error) {
        Log.writeLog(Log.eLogLevel.error, '[getTeamWiseOrderStatusReport] : ' + JSON.stringify(errorJsonResponse(error.message.toString(), error.message.toString())), uniqueId);
        next(error);
    }
}
