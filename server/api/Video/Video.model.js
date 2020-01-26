import mongoose from 'mongoose';
import {registerEvents} from './Video.events';

var VideoSchema = new mongoose.Schema({
    id: String,
    service_id: String,
    video_url: String,
    title: String,
    description: String,
    date: String,
    sex: String
});

registerEvents(VideoSchema);
export default mongoose.model('Video', VideoSchema);
