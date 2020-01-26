'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var TeamEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * Team model events
 */

TeamEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Team) {
  for (var e in events) {
    let event = events[e];
    Team.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    TeamEvents.emit(event + ':' + doc._id, doc);
    TeamEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = TeamEvents;
//# sourceMappingURL=Team.events.js.map
