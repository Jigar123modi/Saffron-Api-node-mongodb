/**
 * Video model events
 */

import {EventEmitter} from 'events';
var VideoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VideoEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Video) {
  for(var e in events) {
    let event = events[e];
    Video.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    VideoEvents.emit(event + ':' + doc._id, doc);
    VideoEvents.emit(event, doc);
  };
}

export {registerEvents};
export default VideoEvents;
