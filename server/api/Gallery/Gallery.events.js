/**
 * Gallery model events
 */

import {EventEmitter} from 'events';
var GalleryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GalleryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Gallery) {
  for(var e in events) {
    let event = events[e];
    Gallery.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    GalleryEvents.emit(event + ':' + doc._id, doc);
    GalleryEvents.emit(event, doc);
  };
}

export {registerEvents};
export default GalleryEvents;
