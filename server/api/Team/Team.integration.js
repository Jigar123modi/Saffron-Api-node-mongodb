/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTeam;

describe('Team API:', function() {
  describe('GET /api/Teams', function() {
    var Teams;

    beforeEach(function(done) {
      request(app)
        .get('/api/Teams')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Teams = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Teams).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Teams', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Teams')
        .send({
          name: 'New Team',
          info: 'This is the brand new Team!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTeam = res.body;
          done();
        });
    });

    it('should respond with the newly created Team', function() {
      expect(newTeam.name).to.equal('New Team');
      expect(newTeam.info).to.equal('This is the brand new Team!!!');
    });
  });

  describe('GET /api/Teams/:id', function() {
    var Team;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Teams/${newTeam._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Team = res.body;
          done();
        });
    });

    afterEach(function() {
      Team = {};
    });

    it('should respond with the requested Team', function() {
      expect(Team.name).to.equal('New Team');
      expect(Team.info).to.equal('This is the brand new Team!!!');
    });
  });

  describe('PUT /api/Teams/:id', function() {
    var updatedTeam;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Teams/${newTeam._id}`)
        .send({
          name: 'Updated Team',
          info: 'This is the updated Team!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTeam = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTeam = {};
    });

    it('should respond with the updated Team', function() {
      expect(updatedTeam.name).to.equal('Updated Team');
      expect(updatedTeam.info).to.equal('This is the updated Team!!!');
    });

    it('should respond with the updated Team on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Teams/${newTeam._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Team = res.body;

          expect(Team.name).to.equal('Updated Team');
          expect(Team.info).to.equal('This is the updated Team!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Teams/:id', function() {
    var patchedTeam;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Teams/${newTeam._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Team' },
          { op: 'replace', path: '/info', value: 'This is the patched Team!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTeam = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTeam = {};
    });

    it('should respond with the patched Team', function() {
      expect(patchedTeam.name).to.equal('Patched Team');
      expect(patchedTeam.info).to.equal('This is the patched Team!!!');
    });
  });

  describe('DELETE /api/Teams/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Teams/${newTeam._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Team does not exist', function(done) {
      request(app)
        .delete(`/api/Teams/${newTeam._id}`)
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
