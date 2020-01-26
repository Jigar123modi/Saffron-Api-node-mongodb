import mongoose from 'mongoose';
import {registerEvents} from './Product.events';

let ProductSchema = new mongoose.Schema({
    id: String,
    service_id: String,
    price: Number,
    offerPrice: Number,
    image_url: String,
    title: String,
    description: String,
    bookingValue: Boolean,
    date: String,
    sex: String
});

registerEvents(ProductSchema);
export default mongoose.model('Product', ProductSchema);
