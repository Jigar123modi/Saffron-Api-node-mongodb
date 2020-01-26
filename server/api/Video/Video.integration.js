/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newVideo;

describe('Video API:', function() {
  describe('GET /api/Videos', function() {
    var Videos;

    beforeEach(function(done) {
      request(app)
        .get('/api/Videos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Videos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Videos).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Videos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Videos')
        .send({
          name: 'New Video',
          info: 'This is the brand new Video!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newVideo = res.body;
          done();
        });
    });

    it('should respond with the newly created Video', function() {
      expect(newVideo.name).to.equal('New Video');
      expect(newVideo.info).to.equal('This is the brand new Video!!!');
    });
  });

  describe('GET /api/Videos/:id', function() {
    var Video;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Videos/${newVideo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Video = res.body;
          done();
        });
    });

    afterEach(function() {
      Video = {};
    });

    it('should respond with the requested Video', function() {
      expect(Video.name).to.equal('New Video');
      expect(Video.info).to.equal('This is the brand new Video!!!');
    });
  });

  describe('PUT /api/Videos/:id', function() {
    var updatedVideo;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Videos/${newVideo._id}`)
        .send({
          name: 'Updated Video',
          info: 'This is the updated Video!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedVideo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVideo = {};
    });

    it('should respond with the updated Video', function() {
      expect(updatedVideo.name).to.equal('Updated Video');
      expect(updatedVideo.info).to.equal('This is the updated Video!!!');
    });

    it('should respond with the updated Video on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Videos/${newVideo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Video = res.body;

          expect(Video.name).to.equal('Updated Video');
          expect(Video.info).to.equal('This is the updated Video!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Videos/:id', function() {
    var patchedVideo;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Videos/${newVideo._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Video' },
          { op: 'replace', path: '/info', value: 'This is the patched Video!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedVideo = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedVideo = {};
    });

    it('should respond with the patched Video', function() {
      expect(patchedVideo.name).to.equal('Patched Video');
      expect(patchedVideo.info).to.equal('This is the patched Video!!!');
    });
  });

  describe('DELETE /api/Videos/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Videos/${newVideo._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Video does not exist', function(done) {
      request(app)
        .delete(`/api/Videos/${newVideo._id}`)
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
