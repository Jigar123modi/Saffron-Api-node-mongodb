'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOauth;

describe('Oauth API:', function() {
  describe('GET /api/oauths', function() {
    var oauths;

    beforeEach(function(done) {
      request(app)
        .get('/api/oauths')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          oauths = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(oauths).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/oauths', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/oauths')
        .send({
          name: 'New Oauth',
          info: 'This is the brand new oauth!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOauth = res.body;
          done();
        });
    });

    it('should respond with the newly created oauth', function() {
      expect(newOauth.name).to.equal('New Oauth');
      expect(newOauth.info).to.equal('This is the brand new oauth!!!');
    });
  });

  describe('GET /api/oauths/:id', function() {
    var oauth;

    beforeEach(function(done) {
      request(app)
        .get(`/api/oauths/${newOauth._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          oauth = res.body;
          done();
        });
    });

    afterEach(function() {
      oauth = {};
    });

    it('should respond with the requested oauth', function() {
      expect(oauth.name).to.equal('New Oauth');
      expect(oauth.info).to.equal('This is the brand new oauth!!!');
    });
  });

  describe('PUT /api/oauths/:id', function() {
    var updatedOauth;

    beforeEach(function(done) {
      request(app)
        .put(`/api/oauths/${newOauth._id}`)
        .send({
          name: 'Updated Oauth',
          info: 'This is the updated oauth!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOauth = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOauth = {};
    });

    it('should respond with the updated oauth', function() {
      expect(updatedOauth.name).to.equal('Updated Oauth');
      expect(updatedOauth.info).to.equal('This is the updated oauth!!!');
    });

    it('should respond with the updated oauth on a subsequent GET', function(done) {
      request(app)
        .get(`/api/oauths/${newOauth._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let oauth = res.body;

          expect(oauth.name).to.equal('Updated Oauth');
          expect(oauth.info).to.equal('This is the updated oauth!!!');

          done();
        });
    });
  });

  describe('PATCH /api/oauths/:id', function() {
    var patchedOauth;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/oauths/${newOauth._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Oauth' },
          { op: 'replace', path: '/info', value: 'This is the patched oauth!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOauth = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOauth = {};
    });

    it('should respond with the patched oauth', function() {
      expect(patchedOauth.name).to.equal('Patched Oauth');
      expect(patchedOauth.info).to.equal('This is the patched oauth!!!');
    });
  });

  describe('DELETE /api/oauths/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/oauths/${newOauth._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when oauth does not exist', function(done) {
      request(app)
        .delete(`/api/oauths/${newOauth._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
