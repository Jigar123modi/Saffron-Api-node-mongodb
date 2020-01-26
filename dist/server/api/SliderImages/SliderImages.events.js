'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var SliderImagesEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * SliderImages model events
 */

SliderImagesEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(SliderImages) {
  for (var e in events) {
    let event = events[e];
    SliderImages.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    SliderImagesEvents.emit(event + ':' + doc._id, doc);
    SliderImagesEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = SliderImagesEvents;
//# sourceMappingURL=SliderImages.events.js.map
