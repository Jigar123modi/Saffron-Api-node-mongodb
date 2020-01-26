/**
 * Main application routes
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (app) {
    // Insert routes below
    app.use('/api/Reports', require('./api/Reports'));
    app.use('/api/TeamMemberProducts', require('./api/TeamMemberProduct'));
    app.use('/api/Videos', require('./api/Video'));
    app.use('/api/SliderImages', require('./api/SliderImages'));
    app.use('/api/Bookings', require('./api/Booking'));
    app.use('/api/TimeSlots', require('./api/TimeSlot'));
    app.use('/api/Products', require('./api/Product'));
    app.use('/api/Teams', require('./api/Team'));
    app.use('/api/Services', require('./api/Service'));
    app.use('/api/Gallerys', require('./api/Gallery'));
    app.use('/api/oauths', require('./api/oauth'));
    app.use('/api/things', require('./api/thing'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_errors2.default[404]);

    // All other routes should redirect to the app.html
    app.route('/*').get((req, res) => {
        res.sendFile(_path2.default.resolve(`${app.get('appPath')}/app.html`));
    });
};

var _errors = require('./components/errors');

var _errors2 = _interopRequireDefault(_errors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map
