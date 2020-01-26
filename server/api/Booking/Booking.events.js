/**
 * Booking model events
 */

import {EventEmitter} from 'events';
var BookingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BookingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Booking) {
  for(var e in events) {
    let event = events[e];
    Booking.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    BookingEvents.emit(event + ':' + doc._id, doc);
    BookingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default BookingEvents;
