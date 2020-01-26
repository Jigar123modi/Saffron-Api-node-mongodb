/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBooking;

describe('Booking API:', function() {
  describe('GET /api/Bookings', function() {
    var Bookings;

    beforeEach(function(done) {
      request(app)
        .get('/api/Bookings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Bookings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Bookings).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Bookings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Bookings')
        .send({
          name: 'New Booking',
          info: 'This is the brand new Booking!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBooking = res.body;
          done();
        });
    });

    it('should respond with the newly created Booking', function() {
      expect(newBooking.name).to.equal('New Booking');
      expect(newBooking.info).to.equal('This is the brand new Booking!!!');
    });
  });

  describe('GET /api/Bookings/:id', function() {
    var Booking;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Bookings/${newBooking._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Booking = res.body;
          done();
        });
    });

    afterEach(function() {
      Booking = {};
    });

    it('should respond with the requested Booking', function() {
      expect(Booking.name).to.equal('New Booking');
      expect(Booking.info).to.equal('This is the brand new Booking!!!');
    });
  });

  describe('PUT /api/Bookings/:id', function() {
    var updatedBooking;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Bookings/${newBooking._id}`)
        .send({
          name: 'Updated Booking',
          info: 'This is the updated Booking!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBooking = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBooking = {};
    });

    it('should respond with the updated Booking', function() {
      expect(updatedBooking.name).to.equal('Updated Booking');
      expect(updatedBooking.info).to.equal('This is the updated Booking!!!');
    });

    it('should respond with the updated Booking on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Bookings/${newBooking._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Booking = res.body;

          expect(Booking.name).to.equal('Updated Booking');
          expect(Booking.info).to.equal('This is the updated Booking!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Bookings/:id', function() {
    var patchedBooking;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Bookings/${newBooking._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Booking' },
          { op: 'replace', path: '/info', value: 'This is the patched Booking!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBooking = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBooking = {};
    });

    it('should respond with the patched Booking', function() {
      expect(patchedBooking.name).to.equal('Patched Booking');
      expect(patchedBooking.info).to.equal('This is the patched Booking!!!');
    });
  });

  describe('DELETE /api/Bookings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Bookings/${newBooking._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Booking does not exist', function(done) {
      request(app)
        .delete(`/api/Bookings/${newBooking._id}`)
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
