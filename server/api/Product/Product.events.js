/**
 * Product model events
 */

import {EventEmitter} from 'events';
var ProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Product) {
  for(var e in events) {
    let event = events[e];
    Product.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ProductEvents.emit(event + ':' + doc._id, doc);
    ProductEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ProductEvents;
