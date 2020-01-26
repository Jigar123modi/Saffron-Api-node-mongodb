/**
 * Oauth model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var OauthEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
OauthEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Oauth) {
  for (var e in events) {
    let event = events[e];
    Oauth.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    OauthEvents.emit(event + ':' + doc._id, doc);
    OauthEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = OauthEvents;
//# sourceMappingURL=oauth.events.js.map
