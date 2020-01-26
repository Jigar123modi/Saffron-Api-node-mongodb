/**
 * Service model events
 */

import {EventEmitter} from 'events';
var ServiceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ServiceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Service) {
  for(var e in events) {
    let event = events[e];
    Service.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ServiceEvents.emit(event + ':' + doc._id, doc);
    ServiceEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ServiceEvents;
