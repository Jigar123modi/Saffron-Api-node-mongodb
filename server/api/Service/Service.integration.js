/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newService;

describe('Service API:', function() {
  describe('GET /api/Services', function() {
    var Services;

    beforeEach(function(done) {
      request(app)
        .get('/api/Services')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Services = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Services).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Services', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Services')
        .send({
          name: 'New Service',
          info: 'This is the brand new Service!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newService = res.body;
          done();
        });
    });

    it('should respond with the newly created Service', function() {
      expect(newService.name).to.equal('New Service');
      expect(newService.info).to.equal('This is the brand new Service!!!');
    });
  });

  describe('GET /api/Services/:id', function() {
    var Service;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Services/${newService._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Service = res.body;
          done();
        });
    });

    afterEach(function() {
      Service = {};
    });

    it('should respond with the requested Service', function() {
      expect(Service.name).to.equal('New Service');
      expect(Service.info).to.equal('This is the brand new Service!!!');
    });
  });

  describe('PUT /api/Services/:id', function() {
    var updatedService;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Services/${newService._id}`)
        .send({
          name: 'Updated Service',
          info: 'This is the updated Service!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedService = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedService = {};
    });

    it('should respond with the updated Service', function() {
      expect(updatedService.name).to.equal('Updated Service');
      expect(updatedService.info).to.equal('This is the updated Service!!!');
    });

    it('should respond with the updated Service on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Services/${newService._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Service = res.body;

          expect(Service.name).to.equal('Updated Service');
          expect(Service.info).to.equal('This is the updated Service!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Services/:id', function() {
    var patchedService;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Services/${newService._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Service' },
          { op: 'replace', path: '/info', value: 'This is the patched Service!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedService = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedService = {};
    });

    it('should respond with the patched Service', function() {
      expect(patchedService.name).to.equal('Patched Service');
      expect(patchedService.info).to.equal('This is the patched Service!!!');
    });
  });

  describe('DELETE /api/Services/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Services/${newService._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Service does not exist', function(done) {
      request(app)
        .delete(`/api/Services/${newService._id}`)
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
