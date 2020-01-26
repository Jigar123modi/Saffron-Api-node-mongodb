/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var VideoCtrlStub = {
  index: 'VideoCtrl.index',
  show: 'VideoCtrl.show',
  create: 'VideoCtrl.create',
  upsert: 'VideoCtrl.upsert',
  patch: 'VideoCtrl.patch',
  destroy: 'VideoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var VideoIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Video.controller': VideoCtrlStub
});

describe('Video API Router:', function() {
  it('should return an express router instance', function() {
    expect(VideoIndex).to.equal(routerStub);
  });

  describe('GET /api/Videos', function() {
    it('should route to Video.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'VideoCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/Videos/:id', function() {
    it('should route to Video.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'VideoCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/Videos', function() {
    it('should route to Video.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'VideoCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/Videos/:id', function() {
    it('should route to Video.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'VideoCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Videos/:id', function() {
    it('should route to Video.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'VideoCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Videos/:id', function() {
    it('should route to Video.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'VideoCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
