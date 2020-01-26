/**
 * TeamMemberProduct model events
 */

import {EventEmitter} from 'events';
var TeamMemberProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TeamMemberProductEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(TeamMemberProduct) {
  for(var e in events) {
    let event = events[e];
    TeamMemberProduct.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TeamMemberProductEvents.emit(event + ':' + doc._id, doc);
    TeamMemberProductEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TeamMemberProductEvents;
