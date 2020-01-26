/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var BookingCtrlStub = {
  index: 'BookingCtrl.index',
  show: 'BookingCtrl.show',
  create: 'BookingCtrl.create',
  upsert: 'BookingCtrl.upsert',
  patch: 'BookingCtrl.patch',
  destroy: 'BookingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var BookingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Booking.controller': BookingCtrlStub
});

describe('Booking API Router:', function() {
  it('should return an express router instance', function() {
    expect(BookingIndex).to.equal(routerStub);
  });

  describe('GET /api/Bookings', function() {
    it('should route to Booking.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'BookingCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Bookings/:id', function() {
    it('should route to Booking.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'BookingCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Bookings', function() {
    it('should route to Booking.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'BookingCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Bookings/:id', function() {
    it('should route to Booking.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'BookingCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Bookings/:id', function() {
    it('should route to Booking.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'BookingCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Bookings/:id', function() {
    it('should route to Booking.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'BookingCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
