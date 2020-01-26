/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var SliderImagesCtrlStub = {
  index: 'SliderImagesCtrl.index',
  show: 'SliderImagesCtrl.show',
  create: 'SliderImagesCtrl.create',
  upsert: 'SliderImagesCtrl.upsert',
  patch: 'SliderImagesCtrl.patch',
  destroy: 'SliderImagesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var SliderImagesIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './SliderImages.controller': SliderImagesCtrlStub
});

describe('SliderImages API Router:', function() {
  it('should return an express router instance', function() {
    expect(SliderImagesIndex).to.equal(routerStub);
  });

  describe('GET /api/SliderImagess', function() {
    it('should route to SliderImages.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'SliderImagesCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/SliderImagess/:id', function() {
    it('should route to SliderImages.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'SliderImagesCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/SliderImagess', function() {
    it('should route to SliderImages.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'SliderImagesCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/SliderImagess/:id', function() {
    it('should route to SliderImages.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'SliderImagesCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/SliderImagess/:id', function() {
    it('should route to SliderImages.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'SliderImagesCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/SliderImagess/:id', function() {
    it('should route to SliderImages.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'SliderImagesCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
