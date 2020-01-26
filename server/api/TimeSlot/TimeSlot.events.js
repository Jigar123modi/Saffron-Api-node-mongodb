/**
 * TimeSlot model events
 */

import {EventEmitter} from 'events';
var TimeSlotEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TimeSlotEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(TimeSlot) {
  for(var e in events) {
    let event = events[e];
    TimeSlot.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TimeSlotEvents.emit(event + ':' + doc._id, doc);
    TimeSlotEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TimeSlotEvents;
