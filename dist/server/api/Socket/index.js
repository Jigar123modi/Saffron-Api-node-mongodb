'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.socketPublishMessage = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Publish Message To socket.
let socketPublishMessage = exports.socketPublishMessage = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (publishChannelName, publishData) {
        try {
            io.sockets.emit(publishChannelName, publishData);
            return "success";
        } catch (error) {
            return error.message.toString();
        }
    });

    return function socketPublishMessage(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

exports.socketOpen = socketOpen;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let io = null;

// Message Receive functionality.
function socketOpen(server) {
    io = require('socket.io')(server);

    io.sockets.on('connection', socket => {

        socket.on('test', data => {
            //todo create one callback function
            console.log("test", data);
            // socket.broadcast.emit("new test", {
            //     message: data
            // });
        });
    });
}
//# sourceMappingURL=index.js.map
