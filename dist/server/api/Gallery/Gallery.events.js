'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var GalleryEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Gallery model events
 */

GalleryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Gallery) {
  for (var e in events) {
    let event = events[e];
    Gallery.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    GalleryEvents.emit(event + ':' + doc._id, doc);
    GalleryEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = GalleryEvents;
//# sourceMappingURL=Gallery.events.js.map
