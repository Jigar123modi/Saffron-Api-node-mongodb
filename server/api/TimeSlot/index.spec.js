/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var TimeSlotCtrlStub = {
  index: 'TimeSlotCtrl.index',
  show: 'TimeSlotCtrl.show',
  create: 'TimeSlotCtrl.create',
  upsert: 'TimeSlotCtrl.upsert',
  patch: 'TimeSlotCtrl.patch',
  destroy: 'TimeSlotCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var TimeSlotIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './TimeSlot.controller': TimeSlotCtrlStub
});

describe('TimeSlot API Router:', function() {
  it('should return an express router instance', function() {
    expect(TimeSlotIndex).to.equal(routerStub);
  });

  describe('GET /api/TimeSlots', function() {
    it('should route to TimeSlot.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'TimeSlotCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/TimeSlots/:id', function() {
    it('should route to TimeSlot.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'TimeSlotCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/TimeSlots', function() {
    it('should route to TimeSlot.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'TimeSlotCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/TimeSlots/:id', function() {
    it('should route to TimeSlot.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'TimeSlotCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/TimeSlots/:id', function() {
    it('should route to TimeSlot.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'TimeSlotCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/TimeSlots/:id', function() {
    it('should route to TimeSlot.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'TimeSlotCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
