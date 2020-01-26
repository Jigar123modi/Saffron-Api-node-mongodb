/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTimeSlot;

describe('TimeSlot API:', function() {
  describe('GET /api/TimeSlots', function() {
    var TimeSlots;

    beforeEach(function(done) {
      request(app)
        .get('/api/TimeSlots')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          TimeSlots = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(TimeSlots).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/TimeSlots', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/TimeSlots')
        .send({
          name: 'New TimeSlot',
          info: 'This is the brand new TimeSlot!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTimeSlot = res.body;
          done();
        });
    });

    it('should respond with the newly created TimeSlot', function() {
      expect(newTimeSlot.name).to.equal('New TimeSlot');
      expect(newTimeSlot.info).to.equal('This is the brand new TimeSlot!!!');
    });
  });

  describe('GET /api/TimeSlots/:id', function() {
    var TimeSlot;

    beforeEach(function(done) {
      request(app)
        .get(`/api/TimeSlots/${newTimeSlot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          TimeSlot = res.body;
          done();
        });
    });

    afterEach(function() {
      TimeSlot = {};
    });

    it('should respond with the requested TimeSlot', function() {
      expect(TimeSlot.name).to.equal('New TimeSlot');
      expect(TimeSlot.info).to.equal('This is the brand new TimeSlot!!!');
    });
  });

  describe('PUT /api/TimeSlots/:id', function() {
    var updatedTimeSlot;

    beforeEach(function(done) {
      request(app)
        .put(`/api/TimeSlots/${newTimeSlot._id}`)
        .send({
          name: 'Updated TimeSlot',
          info: 'This is the updated TimeSlot!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTimeSlot = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTimeSlot = {};
    });

    it('should respond with the updated TimeSlot', function() {
      expect(updatedTimeSlot.name).to.equal('Updated TimeSlot');
      expect(updatedTimeSlot.info).to.equal('This is the updated TimeSlot!!!');
    });

    it('should respond with the updated TimeSlot on a subsequent GET', function(done) {
      request(app)
        .get(`/api/TimeSlots/${newTimeSlot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let TimeSlot = res.body;

          expect(TimeSlot.name).to.equal('Updated TimeSlot');
          expect(TimeSlot.info).to.equal('This is the updated TimeSlot!!!');

          done();
        });
    });
  });

  describe('PATCH /api/TimeSlots/:id', function() {
    var patchedTimeSlot;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/TimeSlots/${newTimeSlot._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched TimeSlot' },
          { op: 'replace', path: '/info', value: 'This is the patched TimeSlot!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTimeSlot = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTimeSlot = {};
    });

    it('should respond with the patched TimeSlot', function() {
      expect(patchedTimeSlot.name).to.equal('Patched TimeSlot');
      expect(patchedTimeSlot.info).to.equal('This is the patched TimeSlot!!!');
    });
  });

  describe('DELETE /api/TimeSlots/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/TimeSlots/${newTimeSlot._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when TimeSlot does not exist', function(done) {
      request(app)
        .delete(`/api/TimeSlots/${newTimeSlot._id}`)
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
