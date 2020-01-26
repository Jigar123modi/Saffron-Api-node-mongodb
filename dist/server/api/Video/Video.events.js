'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var VideoEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Video model events
 */

VideoEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Video) {
  for (var e in events) {
    let event = events[e];
    Video.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    VideoEvents.emit(event + ':' + doc._id, doc);
    VideoEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = VideoEvents;
//# sourceMappingURL=Video.events.js.map
