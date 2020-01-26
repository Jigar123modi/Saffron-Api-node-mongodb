import mongoose from 'mongoose';
import {registerEvents} from './TeamMemberProduct.events';

var TeamMemberProductSchema = new mongoose.Schema({
    id: String,
    teamMember_id: String,
    product_id: String,
    approxTime: Number
});

registerEvents(TeamMemberProductSchema);
export default mongoose.model('TeamMemberProduct', TeamMemberProductSchema);
