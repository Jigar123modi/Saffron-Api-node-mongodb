/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var TeamCtrlStub = {
  index: 'TeamCtrl.index',
  show: 'TeamCtrl.show',
  create: 'TeamCtrl.create',
  upsert: 'TeamCtrl.upsert',
  patch: 'TeamCtrl.patch',
  destroy: 'TeamCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var TeamIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Team.controller': TeamCtrlStub
});

describe('Team API Router:', function() {
  it('should return an express router instance', function() {
    expect(TeamIndex).to.equal(routerStub);
  });

  describe('GET /api/Teams', function() {
    it('should route to Team.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'TeamCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Teams/:id', function() {
    it('should route to Team.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'TeamCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Teams', function() {
    it('should route to Team.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'TeamCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Teams/:id', function() {
    it('should route to Team.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'TeamCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Teams/:id', function() {
    it('should route to Team.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'TeamCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Teams/:id', function() {
    it('should route to Team.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'TeamCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
