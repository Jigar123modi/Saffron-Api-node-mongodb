'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var oauthCtrlStub = {
  index: 'oauthCtrl.index',
  show: 'oauthCtrl.show',
  create: 'oauthCtrl.create',
  upsert: 'oauthCtrl.upsert',
  patch: 'oauthCtrl.patch',
  destroy: 'oauthCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var oauthIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './oauth.controller': oauthCtrlStub
});

describe('Oauth API Router:', function() {
  it('should return an express router instance', function() {
    expect(oauthIndex).to.equal(routerStub);
  });

  describe('GET /api/oauths', function() {
    it('should route to oauth.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'oauthCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/oauths/:id', function() {
    it('should route to oauth.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'oauthCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/oauths', function() {
    it('should route to oauth.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'oauthCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/oauths/:id', function() {
    it('should route to oauth.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'oauthCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/oauths/:id', function() {
    it('should route to oauth.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'oauthCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/oauths/:id', function() {
    it('should route to oauth.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'oauthCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
