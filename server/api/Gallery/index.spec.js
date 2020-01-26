/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var GalleryCtrlStub = {
  index: 'GalleryCtrl.index',
  show: 'GalleryCtrl.show',
  create: 'GalleryCtrl.create',
  upsert: 'GalleryCtrl.upsert',
  patch: 'GalleryCtrl.patch',
  destroy: 'GalleryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var GalleryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Gallery.controller': GalleryCtrlStub
});

describe('Gallery API Router:', function() {
  it('should return an express router instance', function() {
    expect(GalleryIndex).to.equal(routerStub);
  });

  describe('GET /api/Gallerys', function() {
    it('should route to Gallery.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'GalleryCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Gallerys/:id', function() {
    it('should route to Gallery.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'GalleryCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Gallerys', function() {
    it('should route to Gallery.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'GalleryCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Gallerys/:id', function() {
    it('should route to Gallery.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'GalleryCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Gallerys/:id', function() {
    it('should route to Gallery.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'GalleryCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Gallerys/:id', function() {
    it('should route to Gallery.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'GalleryCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
