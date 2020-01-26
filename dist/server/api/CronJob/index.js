'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddFirstOrder = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let AddFirstOrder = exports.AddFirstOrder = (() => {
    var _ref7 = (0, _asyncToGenerator3.default)(function* (currentDate) {
        _TimeSlot2.default.find({}, { __v: 0, _id: 0 }).then((() => {
            var _ref8 = (0, _asyncToGenerator3.default)(function* (timeSlotList, err) {
                if (!err) {
                    timeSlotList.forEach((() => {
                        var _ref9 = (0, _asyncToGenerator3.default)(function* (singleTimeSlot) {
                            let split = singleTimeSlot.start_time.split(':');
                            let NormalStartDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), split[0], split[1], 0);
                            //Todo set Find query
                            let FindTimeSlot = yield _Booking2.default.findOne({ bookingEndTime: NormalStartDateTime.toUTCString() });
                            if (FindTimeSlot == null) {
                                let BookingAdd = new _Booking2.default({
                                    id: (0, _commonHelper.getGuid)(),
                                    customer_id: 10000000,
                                    basket: {},
                                    teamWiseProductList: {},
                                    total: 0,
                                    bookingDateTime: currentDate.toUTCString(),
                                    bookingStartTime: NormalStartDateTime.toUTCString(),
                                    bookingEndTime: NormalStartDateTime.toUTCString(),
                                    status: 'first Order',
                                    column: 'first Order',
                                    customerName: 'Developer Test',
                                    visited: false,
                                    statusDateTime: currentDate.toUTCString()
                                });
                                yield BookingAdd.save().then((() => {
                                    var _ref10 = (0, _asyncToGenerator3.default)(function* (InsertBooking, err) {
                                        if (!err) {
                                            if (InsertBooking) {
                                                _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[setInterval] : ' + (0, _stringify2.default)('Save Successfully'));
                                            } else {
                                                _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(errorMessage(InsertBooking, InsertBooking)));
                                            }
                                        } else {
                                            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(errorMessage(err.message.toString(), err.message.toString())));
                                        }
                                    });

                                    return function (_x9, _x10) {
                                        return _ref10.apply(this, arguments);
                                    };
                                })());
                            } else {
                                console.log('order has been found in the db');
                                _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + 'order has been found');
                            }
                        });

                        return function (_x8) {
                            return _ref9.apply(this, arguments);
                        };
                    })());
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(errorMessage(err.message.toString(), err.message.toString())));
                    console.log(err);
                }
            });

            return function (_x6, _x7) {
                return _ref8.apply(this, arguments);
            };
        })());
    });

    return function AddFirstOrder(_x5) {
        return _ref7.apply(this, arguments);
    };
})();

var _Booking = require('../Booking/Booking.model');

var _Booking2 = _interopRequireDefault(_Booking);

var _TimeSlot = require('../TimeSlot/TimeSlot.model');

var _TimeSlot2 = _interopRequireDefault(_TimeSlot);

var _index = require('../Socket/index');

var _commonHelper = require('../../config/commonHelper');

var _Log = require('../../config/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let moment = require('moment-timezone');
let _ = require('lodash');

//todo find running late orders
setInterval((0, _asyncToGenerator3.default)(function* () {
    try {

        let startDayDateTime = moment().tz('Asia/Kolkata').startOf('day').format();
        let NormalDateStartDateTime = new Date(startDayDateTime);
        let currentTime = moment.tz('Asia/Kolkata').format();
        let currentDate = new Date(currentTime);

        let _LateBooking = yield _Booking2.default.find({
            status: 'waiting',
            column: 'recent orders',
            bookingStartTime: {
                $gte: NormalDateStartDateTime.toUTCString(),
                $lte: currentDate.toUTCString()
            }
        }).exec();

        yield _promise2.default.all(_LateBooking.map((() => {
            var _ref2 = (0, _asyncToGenerator3.default)(function* (singleBooking) {
                let _singleLateBooking = _LateBooking.find(function (singleLateBooking) {
                    return singleLateBooking.id === singleBooking.id;
                });
                let statusDateTime = currentDate.toUTCString();
                let updateResult = yield _Booking2.default.update({ id: singleBooking.id }, {
                    status: 'late',
                    column: 'running late',
                    statusDateTime: statusDateTime
                }).exec();
                if (updateResult) {
                    if (updateResult.nModified === 1 || updateResult.n === 1) {
                        let sodPublishMessage = {
                            message: 'running late',
                            data: {
                                id: _singleLateBooking.id,
                                status: 'late',
                                column: 'running late',
                                statusDateTime: statusDateTime
                            }
                        };
                        yield (0, _index.socketPublishMessage)('SOD', sodPublishMessage);
                    } else {
                        _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(updateResult));
                        console.log(updateResult);
                    }
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(errorMessage(updateResult, 'contact to Developer')));
                    console.log('contact to developer');
                }

                //Todo for the teamMember
                _singleLateBooking.teamWiseProductList.map((() => {
                    var _ref3 = (0, _asyncToGenerator3.default)(function* (data) {

                        if (data.orderStatus === 'waiting') {

                            //Todo update record
                            yield _Booking2.default.update({ id: _singleLateBooking.id, 'teamWiseProductList.id': data.id }, {
                                $set: {
                                    'teamWiseProductList.$.orderStatus': "late",
                                    'teamWiseProductList.$.column': "running late",
                                    'teamWiseProductList.$.statusDateTime': statusDateTime
                                }
                            });

                            let sodPublishMessage = {
                                message: 'running late',
                                data: {
                                    id: _singleLateBooking.id,
                                    status: 'late',
                                    column: 'running late',
                                    statusDateTime: statusDateTime
                                }
                            };
                            yield (0, _index.socketPublishMessage)(data.id, sodPublishMessage);
                        }
                    });

                    return function (_x2) {
                        return _ref3.apply(this, arguments);
                    };
                })());
            });

            return function (_x) {
                return _ref2.apply(this, arguments);
            };
        })()));

        // check running recent order
        _LateBooking = yield _Booking2.default.find({
            status: 'process',
            column: 'running',
            bookingStartTime: {
                $gte: NormalDateStartDateTime.toUTCString(),
                $lte: currentDate.toUTCString()
            }
        }).exec();

        yield _promise2.default.all(_LateBooking.map((() => {
            var _ref4 = (0, _asyncToGenerator3.default)(function* (singleBooking) {
                let _singleLateBooking = _LateBooking.find(function (singleLateBooking) {
                    return singleLateBooking.id === singleBooking.id;
                });
                let statusDateTime = currentDate.toUTCString();

                //Todo for the teamMember
                _singleLateBooking.teamWiseProductList.map((() => {
                    var _ref5 = (0, _asyncToGenerator3.default)(function* (data) {

                        if (data.orderStatus === 'waiting') {

                            //Todo update record
                            yield _Booking2.default.update({ id: _singleLateBooking.id, 'teamWiseProductList.id': data.id }, {
                                $set: {
                                    'teamWiseProductList.$.orderStatus': "late",
                                    'teamWiseProductList.$.column': "running late",
                                    'teamWiseProductList.$.statusDateTime': statusDateTime
                                }
                            });

                            let sodPublishMessage = {
                                message: 'running late',
                                data: {
                                    id: _singleLateBooking.id,
                                    status: 'late',
                                    column: 'running late',
                                    statusDateTime: statusDateTime
                                }
                            };
                            yield (0, _index.socketPublishMessage)(data.id, sodPublishMessage);
                        }
                    });

                    return function (_x4) {
                        return _ref5.apply(this, arguments);
                    };
                })());
            });

            return function (_x3) {
                return _ref4.apply(this, arguments);
            };
        })()));
    } catch (error) {
        _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[setInterval] : ' + (0, _stringify2.default)(errorMessage(error.message.toString(), error.message.toString())));
        console.log(error);
    }
}), 10000);

setInterval((0, _asyncToGenerator3.default)(function* () {
    let currentTime = moment.tz('Asia/Kolkata').format();
    let currentDate = new Date(currentTime);
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (hours === 9 && minutes === 39) yield AddFirstOrder(currentDate);
}), 60000);
//# sourceMappingURL=index.js.map
