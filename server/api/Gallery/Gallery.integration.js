/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newGallery;

describe('Gallery API:', function() {
  describe('GET /api/Gallerys', function() {
    var Gallerys;

    beforeEach(function(done) {
      request(app)
        .get('/api/Gallerys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Gallerys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Gallerys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Gallerys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Gallerys')
        .send({
          name: 'New Gallery',
          info: 'This is the brand new Gallery!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newGallery = res.body;
          done();
        });
    });

    it('should respond with the newly created Gallery', function() {
      expect(newGallery.name).to.equal('New Gallery');
      expect(newGallery.info).to.equal('This is the brand new Gallery!!!');
    });
  });

  describe('GET /api/Gallerys/:id', function() {
    var Gallery;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Gallerys/${newGallery._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Gallery = res.body;
          done();
        });
    });

    afterEach(function() {
      Gallery = {};
    });

    it('should respond with the requested Gallery', function() {
      expect(Gallery.name).to.equal('New Gallery');
      expect(Gallery.info).to.equal('This is the brand new Gallery!!!');
    });
  });

  describe('PUT /api/Gallerys/:id', function() {
    var updatedGallery;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Gallerys/${newGallery._id}`)
        .send({
          name: 'Updated Gallery',
          info: 'This is the updated Gallery!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedGallery = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGallery = {};
    });

    it('should respond with the updated Gallery', function() {
      expect(updatedGallery.name).to.equal('Updated Gallery');
      expect(updatedGallery.info).to.equal('This is the updated Gallery!!!');
    });

    it('should respond with the updated Gallery on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Gallerys/${newGallery._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Gallery = res.body;

          expect(Gallery.name).to.equal('Updated Gallery');
          expect(Gallery.info).to.equal('This is the updated Gallery!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Gallerys/:id', function() {
    var patchedGallery;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Gallerys/${newGallery._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Gallery' },
          { op: 'replace', path: '/info', value: 'This is the patched Gallery!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedGallery = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedGallery = {};
    });

    it('should respond with the patched Gallery', function() {
      expect(patchedGallery.name).to.equal('Patched Gallery');
      expect(patchedGallery.info).to.equal('This is the patched Gallery!!!');
    });
  });

  describe('DELETE /api/Gallerys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Gallerys/${newGallery._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Gallery does not exist', function(done) {
      request(app)
        .delete(`/api/Gallerys/${newGallery._id}`)
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
