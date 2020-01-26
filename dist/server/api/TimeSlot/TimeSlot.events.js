'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var TimeSlotEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * TimeSlot model events
 */

TimeSlotEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(TimeSlot) {
  for (var e in events) {
    let event = events[e];
    TimeSlot.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    TimeSlotEvents.emit(event + ':' + doc._id, doc);
    TimeSlotEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = TimeSlotEvents;
//# sourceMappingURL=TimeSlot.events.js.map
