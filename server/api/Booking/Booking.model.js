import mongoose from 'mongoose';
import {registerEvents} from './Booking.events';

let teamWiseProductList = new mongoose.Schema({
    endTime: Date,
    startTime: Date,
    statusDateTime: Date,
    column: String,
    orderStatus: String,
    productList: mongoose.Schema.Types.Mixed,
    id: String
});

var BookingSchema = new mongoose.Schema({
    id: String,
    customer_id: Number,
    basket: mongoose.Schema.Types.Mixed,
    teamWiseProductList: [teamWiseProductList],
    total: Number,
    bookingDateTime: Date,
    bookingStartTime: Date,
    bookingEndTime: Date,
    status: String,
    column: String,
    customerName: String,
    visited: Boolean,
    paymentComplete: {type: Boolean, default: false},
    paymentMemberId: {type: String, default: ""},
    paymentMemberName: {type: String, default: ""},
    timeSlotFull: {type: Boolean, default: false},
    statusDateTime: Date
});

registerEvents(BookingSchema);
export default mongoose.model('Booking', BookingSchema);
