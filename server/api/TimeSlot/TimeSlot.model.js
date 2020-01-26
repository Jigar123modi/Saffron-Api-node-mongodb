import mongoose from 'mongoose';
import {registerEvents} from './TimeSlot.events';

var TimeSlotSchema = new mongoose.Schema({
    id: String,
    start_time: String,
    end_time: String,
});

registerEvents(TimeSlotSchema);
export default mongoose.model('TimeSlot', TimeSlotSchema);
