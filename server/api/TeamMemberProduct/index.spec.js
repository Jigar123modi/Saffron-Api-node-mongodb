/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var TeamMemberProductCtrlStub = {
  index: 'TeamMemberProductCtrl.index',
  show: 'TeamMemberProductCtrl.show',
  create: 'TeamMemberProductCtrl.create',
  upsert: 'TeamMemberProductCtrl.upsert',
  patch: 'TeamMemberProductCtrl.patch',
  destroy: 'TeamMemberProductCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var TeamMemberProductIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './TeamMemberProduct.controller': TeamMemberProductCtrlStub
});

describe('TeamMemberProduct API Router:', function() {
  it('should return an express router instance', function() {
    expect(TeamMemberProductIndex).to.equal(routerStub);
  });

  describe('GET /api/TeamMemberProducts', function() {
    it('should route to TeamMemberProduct.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'TeamMemberProductCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/TeamMemberProducts/:id', function() {
    it('should route to TeamMemberProduct.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'TeamMemberProductCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/TeamMemberProducts', function() {
    it('should route to TeamMemberProduct.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'TeamMemberProductCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/TeamMemberProducts/:id', function() {
    it('should route to TeamMemberProduct.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'TeamMemberProductCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/TeamMemberProducts/:id', function() {
    it('should route to TeamMemberProduct.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'TeamMemberProductCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/TeamMemberProducts/:id', function() {
    it('should route to TeamMemberProduct.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'TeamMemberProductCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
