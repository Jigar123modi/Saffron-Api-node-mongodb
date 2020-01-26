/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductCtrlStub = {
  index: 'ProductCtrl.index',
  show: 'ProductCtrl.show',
  create: 'ProductCtrl.create',
  upsert: 'ProductCtrl.upsert',
  patch: 'ProductCtrl.patch',
  destroy: 'ProductCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Product.controller': ProductCtrlStub
});

describe('Product API Router:', function() {
  it('should return an express router instance', function() {
    expect(ProductIndex).to.equal(routerStub);
  });

  describe('GET /api/Products', function() {
    it('should route to Product.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'ProductCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Products/:id', function() {
    it('should route to Product.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'ProductCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Products', function() {
    it('should route to Product.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'ProductCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Products/:id', function() {
    it('should route to Product.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'ProductCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Products/:id', function() {
    it('should route to Product.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'ProductCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Products/:id', function() {
    it('should route to Product.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'ProductCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
