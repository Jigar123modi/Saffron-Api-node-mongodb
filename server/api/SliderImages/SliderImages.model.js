import mongoose from 'mongoose';
import {registerEvents} from './SliderImages.events';

var SliderImagesSchema = new mongoose.Schema({
    id: String,
    image_url: String
});

registerEvents(SliderImagesSchema);
export default mongoose.model('SliderImages', SliderImagesSchema);
