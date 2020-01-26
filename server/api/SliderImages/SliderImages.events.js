/**
 * SliderImages model events
 */

import {EventEmitter} from 'events';
var SliderImagesEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SliderImagesEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(SliderImages) {
  for(var e in events) {
    let event = events[e];
    SliderImages.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    SliderImagesEvents.emit(event + ':' + doc._id, doc);
    SliderImagesEvents.emit(event, doc);
  };
}

export {registerEvents};
export default SliderImagesEvents;
