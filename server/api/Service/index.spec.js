/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ServiceCtrlStub = {
  index: 'ServiceCtrl.index',
  show: 'ServiceCtrl.show',
  create: 'ServiceCtrl.create',
  upsert: 'ServiceCtrl.upsert',
  patch: 'ServiceCtrl.patch',
  destroy: 'ServiceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ServiceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Service.controller': ServiceCtrlStub
});

describe('Service API Router:', function() {
  it('should return an express router instance', function() {
    expect(ServiceIndex).to.equal(routerStub);
  });

  describe('GET /api/Services', function() {
    it('should route to Service.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'ServiceCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Services/:id', function() {
    it('should route to Service.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'ServiceCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Services', function() {
    it('should route to Service.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'ServiceCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Services/:id', function() {
    it('should route to Service.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'ServiceCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Services/:id', function() {
    it('should route to Service.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'ServiceCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Services/:id', function() {
    it('should route to Service.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'ServiceCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
