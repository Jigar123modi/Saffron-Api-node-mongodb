'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var BookingEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Booking model events
 */

BookingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Booking) {
  for (var e in events) {
    let event = events[e];
    Booking.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    BookingEvents.emit(event + ':' + doc._id, doc);
    BookingEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = BookingEvents;
//# sourceMappingURL=Booking.events.js.map
