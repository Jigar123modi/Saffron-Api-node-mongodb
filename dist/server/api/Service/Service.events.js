'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var ServiceEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Service model events
 */

ServiceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Service) {
  for (var e in events) {
    let event = events[e];
    Service.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    ServiceEvents.emit(event + ':' + doc._id, doc);
    ServiceEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = ServiceEvents;
//# sourceMappingURL=Service.events.js.map
