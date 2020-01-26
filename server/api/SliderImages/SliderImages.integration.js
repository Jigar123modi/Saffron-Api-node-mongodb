/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newSliderImages;

describe('SliderImages API:', function() {
  describe('GET /api/SliderImagess', function() {
    var SliderImagess;

    beforeEach(function(done) {
      request(app)
        .get('/api/SliderImagess')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          SliderImagess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(SliderImagess).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/SliderImagess', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/SliderImagess')
        .send({
          name: 'New SliderImages',
          info: 'This is the brand new SliderImages!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSliderImages = res.body;
          done();
        });
    });

    it('should respond with the newly created SliderImages', function() {
      expect(newSliderImages.name).to.equal('New SliderImages');
      expect(newSliderImages.info).to.equal('This is the brand new SliderImages!!!');
    });
  });

  describe('GET /api/SliderImagess/:id', function() {
    var SliderImages;

    beforeEach(function(done) {
      request(app)
        .get(`/api/SliderImagess/${newSliderImages._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          SliderImages = res.body;
          done();
        });
    });

    afterEach(function() {
      SliderImages = {};
    });

    it('should respond with the requested SliderImages', function() {
      expect(SliderImages.name).to.equal('New SliderImages');
      expect(SliderImages.info).to.equal('This is the brand new SliderImages!!!');
    });
  });

  describe('PUT /api/SliderImagess/:id', function() {
    var updatedSliderImages;

    beforeEach(function(done) {
      request(app)
        .put(`/api/SliderImagess/${newSliderImages._id}`)
        .send({
          name: 'Updated SliderImages',
          info: 'This is the updated SliderImages!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSliderImages = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSliderImages = {};
    });

    it('should respond with the updated SliderImages', function() {
      expect(updatedSliderImages.name).to.equal('Updated SliderImages');
      expect(updatedSliderImages.info).to.equal('This is the updated SliderImages!!!');
    });

    it('should respond with the updated SliderImages on a subsequent GET', function(done) {
      request(app)
        .get(`/api/SliderImagess/${newSliderImages._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let SliderImages = res.body;

          expect(SliderImages.name).to.equal('Updated SliderImages');
          expect(SliderImages.info).to.equal('This is the updated SliderImages!!!');

          done();
        });
    });
  });

  describe('PATCH /api/SliderImagess/:id', function() {
    var patchedSliderImages;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/SliderImagess/${newSliderImages._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched SliderImages' },
          { op: 'replace', path: '/info', value: 'This is the patched SliderImages!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSliderImages = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSliderImages = {};
    });

    it('should respond with the patched SliderImages', function() {
      expect(patchedSliderImages.name).to.equal('Patched SliderImages');
      expect(patchedSliderImages.info).to.equal('This is the patched SliderImages!!!');
    });
  });

  describe('DELETE /api/SliderImagess/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/SliderImagess/${newSliderImages._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when SliderImages does not exist', function(done) {
      request(app)
        .delete(`/api/SliderImagess/${newSliderImages._id}`)
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
