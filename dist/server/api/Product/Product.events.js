'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var ProductEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Product model events
 */

ProductEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Product) {
  for (var e in events) {
    let event = events[e];
    Product.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    ProductEvents.emit(event + ':' + doc._id, doc);
    ProductEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = ProductEvents;
//# sourceMappingURL=Product.events.js.map
