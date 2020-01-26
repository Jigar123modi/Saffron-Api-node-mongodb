import mongoose from 'mongoose';
import {registerEvents} from './Service.events';
//var ttl = require('mongoose-ttl');

var ServiceSchema = new mongoose.Schema({
    id: String,
    title: String,
    image_url: String,
    description: String,
    displayOrder: Number,
    date: String,
});

//ServiceSchema.plugin(ttl, {ttl: (1000 * 60 * 5)});

registerEvents(ServiceSchema);
export default mongoose.model('Service', ServiceSchema);
