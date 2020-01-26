import Booking from '../Booking/Booking.model';
import TimeSlot from '../TimeSlot/TimeSlot.model';
import {socketPublishMessage} from '../Socket/index';
import {getGuid} from '../../config/commonHelper';
import Log from '../../config/Log';

let moment = require('moment-timezone');
let _ = require('lodash');

//todo find running late orders
setInterval(async () => {
    try {

        let startDayDateTime = moment().tz('Asia/Kolkata').startOf('day').format();
        let NormalDateStartDateTime = new Date(startDayDateTime);
        let currentTime = moment.tz('Asia/Kolkata').format();
        let currentDate = new Date(currentTime);

        let _LateBooking = await Booking.find({
            status: 'waiting',
            column: 'recent orders',
            bookingStartTime: {
                $gte: NormalDateStartDateTime.toUTCString(),
                $lte: currentDate.toUTCString()
            }
        }).exec();

        await Promise.all(_LateBooking.map(async (singleBooking) => {
            let _singleLateBooking = _LateBooking.find((singleLateBooking) => singleLateBooking.id === singleBooking.id);
            let statusDateTime = currentDate.toUTCString();
            let updateResult = await Booking.update({id: singleBooking.id}, {
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
                    await socketPublishMessage('SOD', sodPublishMessage);

                } else {
                    Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(updateResult));
                    console.log(updateResult);
                }
            } else {
                Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(errorMessage(updateResult,'contact to Developer')));
                console.log('contact to developer');
            }

            //Todo for the teamMember
            _singleLateBooking.teamWiseProductList.map(async(data) => {

                if(data.orderStatus === 'waiting') {

                    //Todo update record
                    await Booking.update({id: _singleLateBooking.id, 'teamWiseProductList.id': data.id}, {
                        $set: {
                            'teamWiseProductList.$.orderStatus': "late",
                            'teamWiseProductList.$.column': "running late",
                            'teamWiseProductList.$.statusDateTime': statusDateTime,
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
                    await socketPublishMessage(data.id, sodPublishMessage);
                }

            });
        }));

        // check running recent order
        _LateBooking = await Booking.find({
            status: 'process',
            column: 'running',
            bookingStartTime: {
                $gte: NormalDateStartDateTime.toUTCString(),
                $lte: currentDate.toUTCString()
            }
        }).exec();

        await Promise.all(_LateBooking.map(async (singleBooking) => {
            let _singleLateBooking = _LateBooking.find((singleLateBooking) => singleLateBooking.id === singleBooking.id);
            let statusDateTime = currentDate.toUTCString();

            //Todo for the teamMember
            _singleLateBooking.teamWiseProductList.map(async(data) => {

                if(data.orderStatus === 'waiting') {

                    //Todo update record
                    await Booking.update({id: _singleLateBooking.id, 'teamWiseProductList.id': data.id}, {
                        $set: {
                            'teamWiseProductList.$.orderStatus': "late",
                            'teamWiseProductList.$.column': "running late",
                            'teamWiseProductList.$.statusDateTime': statusDateTime,
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
                    await socketPublishMessage(data.id, sodPublishMessage);
                }

            });
        }));

    } catch (error) {
        Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(errorMessage(error.message.toString(),error.message.toString())));
        console.log(error);
    }

}, 10000);

setInterval(async() => {
    let currentTime = moment.tz('Asia/Kolkata').format();
    let currentDate = new Date(currentTime);
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (hours === 9 && minutes === 39)
        await AddFirstOrder(currentDate);

}, 60000);

export async function AddFirstOrder(currentDate) {
    TimeSlot.find({}, {__v: 0, _id: 0})
        .then(async(timeSlotList, err) => {
            if(!err) {
                timeSlotList.forEach(async(singleTimeSlot) => {
                    let split = singleTimeSlot.start_time.split(':');
                    let NormalStartDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), split[0], split[1], 0);
                    //Todo set Find query
                    let FindTimeSlot = await Booking.findOne({bookingEndTime: NormalStartDateTime.toUTCString()});
                    if(FindTimeSlot == null) {
                        let BookingAdd = new Booking({
                            id: getGuid(),
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
                        await BookingAdd.save()
                            .then(async function(InsertBooking, err) {
                                if(!err) {
                                    if(InsertBooking) {
                                        Log.writeLog(Log.eLogLevel.info, '[setInterval] : ' + JSON.stringify('Save Successfully'));
                                    } else {
                                        Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(errorMessage(InsertBooking, InsertBooking)));
                                    }
                                } else {
                                    Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(errorMessage(err.message.toString(), err.message.toString())));
                                }
                            });
                    } else {
                        console.log('order has been found in the db');
                        Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + 'order has been found');
                    }
                });
            } else {
                Log.writeLog(Log.eLogLevel.error, '[setInterval] : ' + JSON.stringify(errorMessage(err.message.toString(), err.message.toString())));
                console.log(err);
            }
        });

}
