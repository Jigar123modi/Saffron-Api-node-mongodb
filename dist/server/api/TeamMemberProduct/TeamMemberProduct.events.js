'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var TeamMemberProductEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
/**
 * TeamMemberProduct model events
 */

TeamMemberProductEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(TeamMemberProduct) {
  for (var e in events) {
    let event = events[e];
    TeamMemberProduct.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    TeamMemberProductEvents.emit(event + ':' + doc._id, doc);
    TeamMemberProductEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = TeamMemberProductEvents;
//# sourceMappingURL=TeamMemberProduct.events.js.map
