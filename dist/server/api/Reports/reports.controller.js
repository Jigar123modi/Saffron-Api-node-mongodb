'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTeamWiseOrderStatusReport = exports.getOrderStatusReport = exports.getTotalBillablePrice = exports.getTopUser = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getTopUser = exports.getTopUser = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let getAllUser = yield _oauth2.default.find({}, {
                _id: 0,
                __v: 0,
                description: 0,
                password: 0,
                role: 0,
                block: 0
            }).exec();
            let allTopUserId = [];
            yield _promise2.default.all(getAllUser.map((() => {
                var _ref2 = (0, _asyncToGenerator3.default)(function* (data) {
                    const getAllBookingCountTopUser = yield _Booking2.default.count({ customer_id: { $in: data.contact_no } }).exec();
                    const tmp = { user: data, totalOrder: getAllBookingCountTopUser };
                    allTopUserId.push(tmp);
                });

                return function (_x4) {
                    return _ref2.apply(this, arguments);
                };
            })()));
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
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getTopUser] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            next(error);
        }
    });

    return function getTopUser(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

let getTotalBillablePrice = exports.getTotalBillablePrice = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let getAllUser = yield _oauth2.default.find({ role: 'employee' }, {
                _id: 0,
                __v: 0,
                description: 0,
                password: 0,
                role: 0,
                block: 0
            }).exec();
            let allEmployee = [];
            yield _promise2.default.all(getAllUser.map((() => {
                var _ref4 = (0, _asyncToGenerator3.default)(function* (data) {
                    const getAllBookingOrder = yield _Booking2.default.find({ "teamWiseProductList.id": data.id });
                    let total = 0;
                    getAllBookingOrder.map(function (innerData) {
                        let productList = innerData.teamWiseProductList.find(function (teamWise) {
                            return teamWise.id === data.id;
                        }).productList;
                        productList.map(function (singleProduct) {
                            total += singleProduct.price;
                        });
                    });
                    const tmp = { user: data, totalBillablePrice: total };
                    allEmployee.push(tmp);
                });

                return function (_x8) {
                    return _ref4.apply(this, arguments);
                };
            })()));

            res.status(200).json(allEmployee);
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getTotalBillablePrice] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            next(error);
        }
    });

    return function getTotalBillablePrice(_x5, _x6, _x7) {
        return _ref3.apply(this, arguments);
    };
})();

let getOrderStatusReport = exports.getOrderStatusReport = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let response = [];
            let count = yield _Booking2.default.count({ status: "recent" }).exec();
            response.push({ status: 'recent', total: count });
            count = yield _Booking2.default.count({ status: "process" }).exec();
            response.push({ status: 'process', total: count });
            count = yield _Booking2.default.count({ status: "late" }).exec();
            response.push({ status: 'late', total: count });
            count = yield _Booking2.default.count({ status: "finish" }).exec();
            response.push({ status: 'finish', total: count });
            res.status(200).json(response);
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getOrderStatusReport] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            next(error);
        }
    });

    return function getOrderStatusReport(_x9, _x10, _x11) {
        return _ref5.apply(this, arguments);
    };
})();

let getTeamWiseOrderStatusReport = exports.getTeamWiseOrderStatusReport = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let response = [];

            let getAllUser = yield _oauth2.default.find({ role: 'employee' }, {
                _id: 0,
                __v: 0,
                description: 0,
                password: 0,
                role: 0,
                block: 0
            }).exec();

            yield _promise2.default.all(getAllUser.map((() => {
                var _ref7 = (0, _asyncToGenerator3.default)(function* (data) {
                    let tmp = { user: data, orderStatus: [] };
                    let count = yield _Booking2.default.count({ "teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus": "waiting" }).exec();
                    tmp.orderStatus.push({ status: 'waiting', total: count });
                    count = yield _Booking2.default.count({ "teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus": "process" }).exec();
                    tmp.orderStatus.push({ status: 'process', total: count });
                    count = yield _Booking2.default.count({ "teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus": "late" }).exec();
                    tmp.orderStatus.push({ status: 'late', total: count });
                    count = yield _Booking2.default.count({ "teamWiseProductList.id": data.id, "teamWiseProductList.orderStatus": "finish" }).exec();
                    tmp.orderStatus.push({ status: 'finish', total: count });
                    response.push(tmp);
                });

                return function (_x15) {
                    return _ref7.apply(this, arguments);
                };
            })()));
            res.status(200).json(response);
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getTeamWiseOrderStatusReport] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            next(error);
        }
    });

    return function getTeamWiseOrderStatusReport(_x12, _x13, _x14) {
        return _ref6.apply(this, arguments);
    };
})();

var _oauth = require('../oauth/oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

var _Booking = require('../Booking/Booking.model');

var _Booking2 = _interopRequireDefault(_Booking);

var _commonHelper = require('../../config/commonHelper');

var _Log = require('../../config/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=reports.controller.js.map
