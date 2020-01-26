import mongoose from 'mongoose';

var BookingItemsSchema = new mongoose.Schema({
    id: String,
    booking_id: String,
    product_id: String,
    team_id: String,
    active: Boolean
});

export default mongoose.model('BookingItems', BookingItemsSchema);
