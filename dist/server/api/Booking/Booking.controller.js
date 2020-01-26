'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTeamMemberBookingOrder = exports.updateBookingEmployeeOrder = exports.updateBookingOrder = exports.getBookingOrder = exports.index = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// New Booking
let index = exports.index = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let startTimeHours = req.body.startTime.hours;
            let startTimeMinutes = req.body.startTime.minutes;
            let endTimeHours = req.body.endTime.hours;
            let endTimeMinutes = req.body.endTime.minutes;
            let bookingProduct = req.body.bookingProduct;
            let totalTime = 0;
            let allProductFound = true;
            let userId = req.decoded.user.userId;
            let fullName = req.decoded.user.first_name + ' ' + req.decoded.user.last_name;
            let bookingStartDateTime = '';
            let bookingEndDateTime = '';
            let momentDateTime = moment().tz('Asia/Kolkata').format();
            let currentDate = new Date(momentDateTime);
            let year = currentDate.getFullYear();
            let month = currentDate.getMonth();
            let date = currentDate.getDate();
            let NormalStartDateTime = new Date(year, month, date, startTimeHours, startTimeMinutes, 0);
            let NormalEndDateTime = new Date(year, month, date, endTimeHours, endTimeMinutes, 0);
            let totalPrice = 0;
            let not_acceptAble = false;

            let requestObj = {
                startTimeHours,
                startTimeMinutes,
                endTimeHours,
                endTimeMinutes,
                bookingProduct,
                totalTime,
                allProductFound,
                userId,
                fullName,
                bookingStartDateTime,
                bookingEndDateTime,
                momentDateTime,
                currentDate,
                year,
                month,
                date,
                NormalStartDateTime,
                NormalEndDateTime,
                totalPrice,
                not_acceptAble
            };

            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[POST:Bookings] : ' + (0, _stringify2.default)(requestObj), uniqueId);

            if (currentDate.getHours() >= 7) {

                //Calculate the total time
                yield _promise2.default.all(bookingProduct.map((() => {
                    var _ref2 = (0, _asyncToGenerator3.default)(function* (singleBookingProduct) {

                        let TeamMemberProductSingle = yield getTeamMemberProductList(singleBookingProduct.product_id, singleBookingProduct.teamMember_id, uniqueId);
                        let ProductItem = yield getProduct(singleBookingProduct.product_id, uniqueId);

                        if (ProductItem !== null) {
                            totalPrice += ProductItem.price;
                        } else {
                            allProductFound = false;
                        }

                        if (TeamMemberProductSingle !== null) {
                            totalTime += TeamMemberProductSingle.approxTime;
                        } else {
                            allProductFound = false;
                        }
                    });

                    return function (_x3) {
                        return _ref2.apply(this, arguments);
                    };
                })()));

                if (!allProductFound) {
                    let message = 'your order has been canceled, so please restart your application and place the booking again. we are sorry for this trouble.';
                    _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(message, message)), uniqueId);
                    res.status(400).json((0, _commonHelper.errorJsonResponse)(message, message));
                } else {

                    //check currentTime and booking selected time.
                    if (currentDate.getTime() < NormalEndDateTime.getTime()) {

                        //get LastBooking order
                        let _LastBooking = yield getLastBookingOrder(NormalStartDateTime, NormalEndDateTime, uniqueId);

                        if (_LastBooking !== null && _LastBooking.visited === false) {

                            //Get Booking LastTime
                            let lastBookingDateTimeCalculation = moment.tz(_LastBooking.bookingEndTime, 'Asia/Kolkata').format();
                            let addMinute = new Date(lastBookingDateTimeCalculation);
                            if (currentDate.getTime() < addMinute.getTime() && _LastBooking.status !== 'finish') {
                                addMinute.setMinutes(addMinute.getMinutes() + totalTime);
                                //set arrivalTime
                                bookingStartDateTime = new Date(_LastBooking.bookingEndTime).toUTCString();
                                //set order finish time.
                                bookingEndDateTime = addMinute.toUTCString();
                            } else {
                                let currentTimeWithZeroMinutes = new Date(year, month, date, currentDate.getHours(), currentDate.getMinutes(), 0);
                                bookingStartDateTime = currentTimeWithZeroMinutes.toUTCString();
                                addMinute = currentTimeWithZeroMinutes;
                                addMinute.setMinutes(currentTimeWithZeroMinutes.getMinutes() + totalTime);
                                bookingEndDateTime = addMinute.toUTCString();
                            }

                            const diffTime = Math.abs(NormalEndDateTime.getTime() - addMinute.getTime());
                            const diffMinutes = Math.ceil(diffTime / (1000 * 60));
                            if (!(NormalEndDateTime.getTime() >= addMinute.getTime() && diffMinutes >= 0)) {

                                //check last order time and endTimeSlot time has less diff - 5
                                addMinute = new Date(lastBookingDateTimeCalculation);
                                const diffTimeActual = Math.abs(NormalEndDateTime.getTime() - addMinute.getTime());
                                const diffMinutesActual = Math.ceil(diffTimeActual / (1000 * 60));

                                if (diffMinutesActual > 5) {

                                    yield _Booking2.default.findOneAndUpdate({
                                        visited: true,
                                        timeSlotFull: false,
                                        bookingEndTime: {
                                            $gte: NormalStartDateTime.toUTCString(),
                                            $lte: NormalEndDateTime.toUTCString()
                                        }
                                    }, { $set: { visited: false } }, { sort: { bookingEndTime: -1 } }).exec();

                                    throw new Error(`your selected time slot has been full for your order, you can remove some item from the basket and again place the order otherwise you can select another time slot for this order`);
                                } else {

                                    yield _Booking2.default.findOneAndUpdate({
                                        visited: true,
                                        timeSlotFull: false,
                                        bookingEndTime: {
                                            $gte: NormalStartDateTime.toUTCString(),
                                            $lte: NormalEndDateTime.toUTCString()
                                        }
                                    }, { $set: { timeSlotFull: true } }, { sort: { bookingEndTime: -1 } }).exec();

                                    throw new Error('your selected time slot has been full please select another time slot and please order again');
                                }
                            }
                        } else {

                            //Never execute this part.
                            //first order set stating time and add minutes and generate end time
                            if (currentDate.getTime() < NormalStartDateTime.getTime()) {
                                bookingStartDateTime = NormalStartDateTime.toUTCString();
                                let addMinute = NormalStartDateTime;
                                addMinute.setMinutes(NormalStartDateTime.getMinutes() + totalTime);
                                bookingEndDateTime = addMinute.toUTCString();
                            } else {
                                bookingStartDateTime = currentDate.toUTCString();
                                let addMinute = currentDate;
                                addMinute.setMinutes(currentDate.getMinutes() + totalTime);
                                bookingEndDateTime = addMinute.toUTCString();
                            }
                        }

                        if (!not_acceptAble) {

                            //Generate the Basket Response.
                            let BasketResponseGenerator = yield BasketGenerator(bookingProduct, bookingStartDateTime, uniqueId);

                            let BookingAdd = new _Booking2.default({
                                id: (0, _commonHelper.getGuid)(),
                                customer_id: userId,
                                basket: BasketResponseGenerator.basketResponse,
                                teamWiseProductList: BasketResponseGenerator.teamWiseProductList,
                                total: totalPrice,
                                bookingDateTime: currentDate.toUTCString(),
                                bookingStartTime: bookingStartDateTime,
                                bookingEndTime: bookingEndDateTime,
                                status: 'waiting',
                                column: 'recent orders',
                                customerName: fullName,
                                visited: false,
                                statusDateTime: bookingStartDateTime
                            });
                            BookingAdd.save().then((() => {
                                var _ref3 = (0, _asyncToGenerator3.default)(function* (InsertBooking, err) {
                                    if (!err) {
                                        if (InsertBooking) {
                                            let responseObject = {
                                                id: InsertBooking.id,
                                                customer_id: InsertBooking.customer_id,
                                                customerName: fullName,
                                                productList: InsertBooking.basket,
                                                total: InsertBooking.total,
                                                bookingDateTime: moment.tz(InsertBooking.bookingDateTime, 'Asia/Kolkata').format(),
                                                arrivalTime: moment.tz(InsertBooking.bookingStartTime, 'Asia/Kolkata').format(),
                                                bookingEndTime: moment.tz(InsertBooking.bookingEndTime, 'Asia/Kolkata').format(),
                                                status: InsertBooking.status,
                                                column: InsertBooking.column,
                                                statusDateTime: moment.tz(InsertBooking.statusDateTime, 'Asia/Kolkata').format(),
                                                _id: InsertBooking._id
                                            };

                                            //ProductItemStore into BookingItem Collection.
                                            yield _promise2.default.all(bookingProduct.map((() => {
                                                var _ref4 = (0, _asyncToGenerator3.default)(function* (singleBookingProduct) {
                                                    let BookingItemsAdd = new _BookingItems2.default({
                                                        id: (0, _commonHelper.getGuid)(),
                                                        booking_id: InsertBooking.id,
                                                        product_id: singleBookingProduct.product_id,
                                                        team_id: singleBookingProduct.teamMember_id,
                                                        active: true
                                                    });
                                                    BookingItemsAdd.save().then((() => {
                                                        var _ref5 = (0, _asyncToGenerator3.default)(function* (InsertBookingItems, err) {
                                                            if (!err) {
                                                                if (!InsertBookingItems) {
                                                                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(err.toString(), 'Error in db BookingItems response')), uniqueId);
                                                                    res.status(400).json((0, _commonHelper.errorJsonResponse)('Error in db BookingItems response', 'Error in db BookingItems response'));
                                                                }
                                                            } else {
                                                                _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(err.toString(), 'Contact to your Developer')), uniqueId);
                                                                res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                                                            }
                                                        });

                                                        return function (_x7, _x8) {
                                                            return _ref5.apply(this, arguments);
                                                        };
                                                    })());
                                                });

                                                return function (_x6) {
                                                    return _ref4.apply(this, arguments);
                                                };
                                            })()));

                                            //ToDO send to SOD
                                            let publishMessage = {
                                                message: 'new order',
                                                data: {
                                                    _id: InsertBooking._id,
                                                    id: InsertBooking.id,
                                                    customer_id: InsertBooking.customer_id,
                                                    customerName: fullName,
                                                    basket: InsertBooking.basket,
                                                    total: InsertBooking.total,
                                                    bookingDateTime: InsertBooking.bookingDateTime,
                                                    bookingStartTime: InsertBooking.bookingStartTime,
                                                    bookingEndTime: InsertBooking.bookingEndTime,
                                                    status: InsertBooking.status,
                                                    column: InsertBooking.column,
                                                    statusDateTime: InsertBooking.statusDateTime,
                                                    paymentComplete: InsertBooking.paymentComplete,
                                                    paymentMemberId: InsertBooking.paymentMemberId,
                                                    paymentMemberName: InsertBooking.paymentMemberName
                                                }
                                            };
                                            yield (0, _index.socketPublishMessage)('SOD', publishMessage);

                                            //ToDO send to TeamMember
                                            BasketResponseGenerator.teamWiseProductList.map((() => {
                                                var _ref6 = (0, _asyncToGenerator3.default)(function* (singleObject) {
                                                    let publishMessage = {
                                                        message: 'new order',
                                                        data: {
                                                            _id: InsertBooking._id,
                                                            id: InsertBooking.id,
                                                            customer_id: InsertBooking.customer_id,
                                                            customerName: fullName,
                                                            teamWiseProductList: BasketResponseGenerator.teamWiseProductList,
                                                            total: InsertBooking.total,
                                                            bookingDateTime: InsertBooking.bookingDateTime,
                                                            bookingStartTime: InsertBooking.bookingStartTime,
                                                            bookingEndTime: InsertBooking.bookingEndTime,
                                                            status: InsertBooking.status,
                                                            column: InsertBooking.column,
                                                            statusDateTime: InsertBooking.statusDateTime,
                                                            paymentComplete: InsertBooking.paymentComplete,
                                                            paymentMemberId: InsertBooking.paymentMemberId,
                                                            paymentMemberName: InsertBooking.paymentMemberName
                                                        }
                                                    };
                                                    yield (0, _index.socketPublishMessage)(singleObject.id, publishMessage);
                                                });

                                                return function (_x9) {
                                                    return _ref6.apply(this, arguments);
                                                };
                                            })());

                                            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[POST:Bookings] : ' + (0, _stringify2.default)({
                                                totalTime,
                                                orderPlace: responseObject
                                            }), uniqueId);
                                            res.status(200).json({ totalTime, orderPlace: responseObject });
                                        } else {
                                            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(InsertBooking, 'Error in db response')), uniqueId);
                                            res.status(400).json((0, _commonHelper.errorJsonResponse)('Error in db response', 'Error in db response'));
                                        }
                                    } else {
                                        _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(err.toString(), 'Error in db response')), uniqueId);
                                        res.status(400).json((0, _commonHelper.errorJsonResponse)(err, 'Contact to your Developer'));
                                    }
                                });

                                return function (_x4, _x5) {
                                    return _ref3.apply(this, arguments);
                                };
                            })());
                        } else {

                            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)('your order has not been Accepted, please select another time slot and book your order', 'your order has not been Accepted, please select another time slot and book your order')), uniqueId);
                            res.status(406).json((0, _commonHelper.errorJsonResponse)('your order has not been Accepted, please select another time slot and book your order', 'your order has not Accepted, please select another time slot and book your order'));
                        }
                    } else {
                        let message = 'you have selected wrong time, please choose the valid time slot.';
                        _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(message, message)), uniqueId);
                        res.status(400).json((0, _commonHelper.errorJsonResponse)(message, message));
                    }
                }
            } else {
                let message = 'Booking will be started at 7 am';
                _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(message, message)), uniqueId);
                res.status(400).json((0, _commonHelper.errorJsonResponse)(message, message));
            }
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[POST:Bookings] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            res.status(400).json((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString()));
        }
    });

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let BasketGenerator = (() => {
    var _ref7 = (0, _asyncToGenerator3.default)(function* (bookingProduct, bookingStartDateTime, uniqueId) {
        try {

            let basketResponse = [];
            let teamWiseProductList = [];

            yield _promise2.default.all(bookingProduct.map((() => {
                var _ref8 = (0, _asyncToGenerator3.default)(function* (bookingItem) {

                    let productItem = yield getProduct(bookingItem.product_id, uniqueId);
                    let productTeam = yield getTeam(bookingItem.teamMember_id, uniqueId);

                    if (productItem && productTeam) {
                        let object = {
                            productItem,
                            productTeam
                        };
                        basketResponse.push(object);

                        let teamMember = teamWiseProductList.find(function (teamMember) {
                            return teamMember.id === productTeam.id;
                        });
                        if (!teamMember) {
                            let pushData = {
                                id: productTeam.id,
                                productList: [],
                                orderStatus: 'waiting',
                                column: 'recent orders',
                                statusDateTime: bookingStartDateTime,
                                startTime: '',
                                endTime: ''
                            };
                            pushData.productList.push(productItem);
                            teamWiseProductList.push(pushData);
                        } else {
                            teamMember.productList.push(productItem);
                        }
                    } else {
                        throw new Error('you have passed wrong id for basket generation');
                    }
                });

                return function (_x13) {
                    return _ref8.apply(this, arguments);
                };
            })()));

            return { basketResponse, teamWiseProductList };
        } catch (error) {
            console.log(error);
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[BasketGenerator] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            throw new Error('you have passed wrong id for basket generation');
        }
    });

    return function BasketGenerator(_x10, _x11, _x12) {
        return _ref7.apply(this, arguments);
    };
})();

let getProduct = (() => {
    var _ref9 = (0, _asyncToGenerator3.default)(function* (productId, uniqueId, index = 0) {
        let listProductList = (0, _commonHelper.getCache)('productList');
        if (listProductList !== null) {
            let singleProduct = listProductList.find(function (product) {
                return product.id === productId;
            });
            if (singleProduct) {
                return singleProduct;
            } else {
                if (index === 0) {
                    listProductList = yield _Product2.default.find({}, { _id: 0, __v: 0, description: 0, date: 0, sex: 0, bookingValue: 0 }).exec();
                    (0, _commonHelper.setCache)('productList', listProductList);
                    return getProduct(productId, uniqueId, 1);
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, `[getProduct] : Product not found = ${productId}`, uniqueId);
                    return null;
                }
            }
        } else {
            listProductList = yield _Product2.default.find({}, { _id: 0, __v: 0, description: 0, date: 0, sex: 0, bookingValue: 0 }).exec();
            (0, _commonHelper.setCache)('productList', listProductList);
            return getProduct(productId, uniqueId, 1);
        }
    });

    return function getProduct(_x14, _x15) {
        return _ref9.apply(this, arguments);
    };
})();

let getLastBookingOrder = (() => {
    var _ref10 = (0, _asyncToGenerator3.default)(function* (NormalStartDateTime, NormalEndDateTime, uniqueId) {

        let _LastBookingOrder = yield _Booking2.default.findOneAndUpdate({
            visited: false,
            bookingEndTime: { $gte: NormalStartDateTime.toUTCString(), $lte: NormalEndDateTime.toUTCString() }
        }, { $set: { visited: true } }, { sort: { bookingEndTime: -1 } }).exec();

        //Todo should not be received null value
        if (_LastBookingOrder === null) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getLastBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(_LastBookingOrder, _LastBookingOrder)), uniqueId);

            let _LastBookingOrderAgain = yield _Booking2.default.findOneAndUpdate({
                visited: true, timeSlotFull: true,
                bookingEndTime: { $gte: NormalStartDateTime.toUTCString(), $lte: NormalEndDateTime.toUTCString() }
            }, { sort: { bookingEndTime: -1 } }).exec();

            if (_LastBookingOrderAgain) {
                throw new Error('your selected time slot has been full please select another time slot and please order again');
            } else {
                return getLastBookingOrder(NormalStartDateTime, NormalEndDateTime, uniqueId);
            }
        } else if (_LastBookingOrder.visited === true) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[getLastBookingOrder-true] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(_LastBookingOrder, _LastBookingOrder)), uniqueId);
            return getLastBookingOrder(NormalStartDateTime, NormalEndDateTime, uniqueId);
        } else {
            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[getLastBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(_LastBookingOrder, _LastBookingOrder)), uniqueId);
            return _LastBookingOrder;
        }
    });

    return function getLastBookingOrder(_x16, _x17, _x18) {
        return _ref10.apply(this, arguments);
    };
})();

let getTeam = (() => {
    var _ref11 = (0, _asyncToGenerator3.default)(function* (teamId, uniqueId, index = 0) {
        let teamList = (0, _commonHelper.getCache)('teamLists');
        if (teamList !== null) {
            let singleTeam = teamList.find(function (team) {
                return team.id === teamId;
            });
            if (singleTeam) {
                return singleTeam;
            } else {
                if (index === 0) {
                    teamList = yield _oauth2.default.find({ role: 'employee' }, {
                        _id: 0,
                        __v: 0,
                        description: 0,
                        userId: 0,
                        password: 0,
                        role: 0,
                        block: 0
                    }).exec();
                    (0, _commonHelper.setCache)('teamLists', teamList);
                    return getTeam(teamId, uniqueId, 1);
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, `[getTeam] : TeamMember not found = ${teamId}`, uniqueId);
                    return null;
                }
            }
        } else {
            teamList = yield _oauth2.default.find({ role: 'employee' }, {
                _id: 0,
                __v: 0,
                description: 0,
                userId: 0,
                password: 0,
                role: 0,
                block: 0
            }).exec();
            (0, _commonHelper.setCache)('teamLists', teamList);
            return getTeam(teamId, uniqueId, 1);
        }
    });

    return function getTeam(_x19, _x20) {
        return _ref11.apply(this, arguments);
    };
})();

let getTeamMemberProductList = (() => {
    var _ref12 = (0, _asyncToGenerator3.default)(function* (product_id, teamMember_id, uniqueId, index = 0) {
        let teamMemberProductList = (0, _commonHelper.getCache)('teamMemberProductList');
        if (teamMemberProductList !== null) {
            let singleTeamMemberProduct = teamMemberProductList.find(function (teamMemberProduct) {
                return teamMemberProduct.product_id === product_id && teamMemberProduct.teamMember_id === teamMember_id;
            });
            if (singleTeamMemberProduct) {
                return singleTeamMemberProduct;
            } else {
                if (index === 0) {
                    teamMemberProductList = yield _TeamMemberProduct2.default.find().exec();
                    (0, _commonHelper.setCache)('teamMemberProductList', teamMemberProductList);
                    return getTeamMemberProductList(product_id, teamMember_id, uniqueId, 1);
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, `[getTeamMemberProductList] : Record not found ProductId = ${product_id}  teamId = ${teamMember_id}`, uniqueId);
                    return null;
                }
            }
        } else {
            teamMemberProductList = yield _TeamMemberProduct2.default.find().exec();
            (0, _commonHelper.setCache)('teamMemberProductList', teamMemberProductList);
            return getTeamMemberProductList(product_id, teamMember_id, uniqueId, 1);
        }
    });

    return function getTeamMemberProductList(_x21, _x22, _x23) {
        return _ref12.apply(this, arguments);
    };
})();

let getBookingOrder = exports.getBookingOrder = (() => {
    var _ref13 = (0, _asyncToGenerator3.default)(function* (req, res) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {
            let startDayDateTime = moment().tz('Asia/Kolkata').startOf('day').format();
            let endDayDateTime = moment().tz('Asia/Kolkata').endOf('day').format();
            let NormalDateStartDateTime = new Date(startDayDateTime);
            let NormalDateEndDateTime = new Date(endDayDateTime);

            let responseObject = {
                runningOrder: [],
                runningLate: [],
                recentOrders: [],
                recentComplete: []
            };

            let recentOrders = yield _Booking2.default.find({
                status: 'waiting',
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                }
            }, { teamWiseProductList: 0 }).sort({ bookingStartTime: 1 }).exec();

            let runningOrders = yield _Booking2.default.find({
                status: 'process',
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                }
            }, { teamWiseProductList: 0 }).sort({ bookingStartTime: 1 }).exec();

            let lateOrders = yield _Booking2.default.find({
                status: 'late',
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                }
            }, { teamWiseProductList: 0 }).sort({ bookingStartTime: 1 }).exec();

            let recentComplete = yield _Booking2.default.find({
                status: 'finish',
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                }
            }, { teamWiseProductList: 0 }).sort({ bookingStartTime: 1 }).exec();

            responseObject.recentOrders = recentOrders;
            responseObject.runningLate = lateOrders;
            responseObject.runningOrder = runningOrders;
            responseObject.recentComplete = recentComplete;

            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[getBookingOrder] : ' + (0, _stringify2.default)(responseObject), uniqueId);
            res.status(200).json(responseObject);
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            console.log(error);
        }
    });

    return function getBookingOrder(_x24, _x25) {
        return _ref13.apply(this, arguments);
    };
})();

let updateBookingOrder = exports.updateBookingOrder = (() => {
    var _ref14 = (0, _asyncToGenerator3.default)(function* (req, res) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {

            const orderId = req.params.orderId;
            const paymentMemberId = req.decoded.user.id;
            const paymentMemberName = req.decoded.user.first_name + ' ' + req.decoded.user.last_name;
            let orderType = req.body.orderType;

            if (orderType === 'payment finish') {

                const message = 'payment finish';

                const updateResult = yield _Booking2.default.update({ id: orderId }, {
                    paymentComplete: true,
                    paymentMemberId: paymentMemberId,
                    paymentMemberName: paymentMemberName
                }).exec();

                if (updateResult) {
                    if (updateResult.nModified === 1 || updateResult.n === 1) {
                        let sodPublishMessage = {
                            message: message,
                            data: {
                                id: orderId,
                                paymentComplete: true,
                                paymentMemberId: paymentMemberId,
                                paymentMemberName: paymentMemberName
                            }
                        };
                        yield (0, _index.socketPublishMessage)('SOD', sodPublishMessage);
                        let _singleLateBooking = yield _Booking2.default.findOne({ id: orderId }).exec();

                        //TODO send to teamMember
                        _singleLateBooking.teamWiseProductList.forEach((() => {
                            var _ref15 = (0, _asyncToGenerator3.default)(function* (singleTeamWiseProductList) {
                                yield (0, _index.socketPublishMessage)(singleTeamWiseProductList.id, sodPublishMessage);
                            });

                            return function (_x28) {
                                return _ref15.apply(this, arguments);
                            };
                        })());
                        _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[updateBookingOrder] : ' + (0, _stringify2.default)({ result: true }), uniqueId);
                        res.status(200).json({ result: true });
                    } else {
                        _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(updateResult, { result: false })), uniqueId);
                        res.status(200).json({ result: false });
                        console.log(updateResult);
                    }
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)('contact to developer', { result: false })), uniqueId);
                    console.log('contact to developer');
                }
            } else {
                res.status(400).json({ result: false });
            }
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            console.log(error);
        }
    });

    return function updateBookingOrder(_x26, _x27) {
        return _ref14.apply(this, arguments);
    };
})();

let updateBookingEmployeeOrder = exports.updateBookingEmployeeOrder = (() => {
    var _ref16 = (0, _asyncToGenerator3.default)(function* (req, res, next) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {

            let orderId = req.params.orderId;
            let teamMemberId = req.params.teamMemberId;
            let orderType = req.body.orderType;

            let currentTime = moment.tz('Asia/Kolkata').format();
            let currentDate = new Date(currentTime);
            let statusDateTime = currentDate.toUTCString();

            let status = 'process';
            let column = 'running';
            let message = 'running';

            if (orderType === 'finish') {
                status = 'finish';
                column = 'finish';
                message = 'finish';
            }

            //Todo update innerData for TeamMember orderstatus,startTime,orderstatusTime
            let updateResultTeamMember = null;
            if (orderType === 'finish') {
                updateResultTeamMember = yield _Booking2.default.update({ id: orderId, 'teamWiseProductList.id': teamMemberId }, {
                    $set: {
                        'teamWiseProductList.$.orderStatus': status,
                        'teamWiseProductList.$.column': column,
                        'teamWiseProductList.$.statusDateTime': statusDateTime,
                        'teamWiseProductList.$.endTime': statusDateTime
                    }
                });
            } else {
                updateResultTeamMember = yield _Booking2.default.update({ id: orderId, 'teamWiseProductList.id': teamMemberId }, {
                    $set: {
                        'teamWiseProductList.$.orderStatus': status,
                        'teamWiseProductList.$.column': column,
                        'teamWiseProductList.$.statusDateTime': statusDateTime,
                        'teamWiseProductList.$.startTime': statusDateTime
                    }
                });
            }

            if (updateResultTeamMember) {

                if (updateResultTeamMember.nModified > 0 || updateResultTeamMember.n > 0) {

                    if (orderType !== 'finish') {
                        let updateResult = yield _Booking2.default.update({ id: orderId, column: { $ne: column } }, {
                            status: status,
                            column: column,
                            statusDateTime: statusDateTime
                        }).exec();

                        let sodPublishMessage = {
                            message: message,
                            data: {
                                id: orderId,
                                orderType: orderType,
                                status: status,
                                column: column,
                                statusDateTime: statusDateTime
                            }
                        };

                        if (updateResult.nModified > 0 || updateResult.n > 0) {
                            yield (0, _index.socketPublishMessage)('SOD', sodPublishMessage);
                            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[updateBookingOrderSOD] : ' + (0, _stringify2.default)({ result: true }), uniqueId);
                        }

                        yield (0, _index.socketPublishMessage)(teamMemberId, sodPublishMessage);
                        _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[updateBookingOrderTeamMember] : ' + (0, _stringify2.default)({ result: true }), uniqueId);
                        res.status(200).json({ result: true });
                    } else {

                        let sodPublishMessage = {
                            message: message,
                            data: {
                                id: orderId,
                                orderType: orderType,
                                status: status,
                                column: column,
                                statusDateTime: statusDateTime
                            }
                        };

                        let findResult = yield _Booking2.default.find({
                            id: orderId,
                            'teamWiseProductList.orderStatus': 'waiting'
                        }).exec();

                        let findResult1 = yield _Booking2.default.find({
                            id: orderId,
                            'teamWiseProductList.orderStatus': 'process'
                        }).exec();

                        let findResult2 = yield _Booking2.default.find({
                            id: orderId,
                            'teamWiseProductList.orderStatus': 'late'
                        }).exec();

                        if (!(findResult.length > 0 || findResult1.length > 0 || findResult2.length > 0)) {

                            let updateResult = yield _Booking2.default.update({ id: orderId }, {
                                status: status,
                                column: column,
                                statusDateTime: statusDateTime
                            }).exec();

                            if (updateResult.nModified > 0 || updateResult.n > 0) {
                                yield (0, _index.socketPublishMessage)('SOD', sodPublishMessage);
                                _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[updateBookingOrderSOD] : ' + (0, _stringify2.default)({ result: true }), uniqueId);
                            } else {
                                _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrderSOD] : ' + (0, _stringify2.default)(updateResult), uniqueId);
                                res.status(200).json({ result: false });
                            }
                        }

                        yield (0, _index.socketPublishMessage)(teamMemberId, sodPublishMessage);
                        _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[updateBookingOrderTeamMember] : ' + (0, _stringify2.default)({ result: true }), uniqueId);
                        res.status(200).json({ result: true });
                    }
                } else {
                    _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)('contact to developer', { result: false })), uniqueId);
                    res.status(200).json({ result: false });
                }
            } else {
                res.status(200).json({ result: false });
            }
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[updateBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            console.log(error);
        }
    });

    return function updateBookingEmployeeOrder(_x29, _x30, _x31) {
        return _ref16.apply(this, arguments);
    };
})();

let getTeamMemberBookingOrder = exports.getTeamMemberBookingOrder = (() => {
    var _ref17 = (0, _asyncToGenerator3.default)(function* (req, res) {
        let uniqueId = (0, _commonHelper.getGuid)();
        try {

            let teamMemberId = req.params.teamMemberId;
            let startDayDateTime = moment().tz('Asia/Kolkata').startOf('day').format();
            let endDayDateTime = moment().tz('Asia/Kolkata').endOf('day').format();
            let NormalDateStartDateTime = new Date(startDayDateTime);
            let NormalDateEndDateTime = new Date(endDayDateTime);

            let responseObject = {
                runningOrder: [],
                runningLate: [],
                recentOrders: [],
                recentComplete: []
            };

            let recentOrders = yield _Booking2.default.find({
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                },
                teamWiseProductList: {
                    $elemMatch: {
                        id: teamMemberId,
                        orderStatus: 'waiting'
                    }
                }
            }, { basket: 0 }).sort({ bookingStartTime: 1 }).exec();

            let runningOrders = yield _Booking2.default.find({
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                },
                teamWiseProductList: {
                    $elemMatch: {
                        id: teamMemberId,
                        orderStatus: 'process'
                    }
                }
            }, { basket: 0 }).sort({ bookingStartTime: 1 }).exec();

            let lateOrders = yield _Booking2.default.find({
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                },
                teamWiseProductList: {
                    $elemMatch: {
                        id: teamMemberId,
                        orderStatus: 'late'
                    }
                }
            }, { basket: 0 }).sort({ bookingStartTime: 1 }).exec();

            let recentComplete = yield _Booking2.default.find({
                bookingEndTime: {
                    $gte: NormalDateStartDateTime.toUTCString(),
                    $lte: NormalDateEndDateTime.toUTCString()
                },
                teamWiseProductList: {
                    $elemMatch: {
                        id: teamMemberId,
                        orderStatus: 'finish'
                    }
                }
            }, { basket: 0 }).sort({ bookingStartTime: 1 }).exec();

            responseObject.recentOrders = recentOrders;
            responseObject.runningLate = lateOrders;
            responseObject.runningOrder = runningOrders;
            responseObject.recentComplete = recentComplete;

            _Log2.default.writeLog(_Log2.default.eLogLevel.info, '[getTeamMemberBookingOrder] : ' + (0, _stringify2.default)(responseObject), uniqueId);
            res.status(200).json(responseObject);
        } catch (error) {
            _Log2.default.writeLog(_Log2.default.eLogLevel.error, '[getTeamMemberBookingOrder] : ' + (0, _stringify2.default)((0, _commonHelper.errorJsonResponse)(error.message.toString(), error.message.toString())), uniqueId);
            console.log(error);
        }
    });

    return function getTeamMemberBookingOrder(_x32, _x33) {
        return _ref17.apply(this, arguments);
    };
})();

var _Booking = require('./Booking.model');

var _Booking2 = _interopRequireDefault(_Booking);

var _TeamMemberProduct = require('../TeamMemberProduct/TeamMemberProduct.model');

var _TeamMemberProduct2 = _interopRequireDefault(_TeamMemberProduct);

var _Product = require('../Product/Product.model');

var _Product2 = _interopRequireDefault(_Product);

var _BookingItems = require('../BookingItems/BookingItems.model');

var _BookingItems2 = _interopRequireDefault(_BookingItems);

var _oauth = require('../oauth/oauth.model');

var _oauth2 = _interopRequireDefault(_oauth);

var _commonHelper = require('../../config/commonHelper');

var _index = require('../Socket/index');

var _Log = require('../../config/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let moment = require('moment-timezone');
let _ = require('lodash');
//# sourceMappingURL=Booking.controller.js.map
