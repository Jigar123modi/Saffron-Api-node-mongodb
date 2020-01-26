/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTeamMemberProduct;

describe('TeamMemberProduct API:', function() {
  describe('GET /api/TeamMemberProducts', function() {
    var TeamMemberProducts;

    beforeEach(function(done) {
      request(app)
        .get('/api/TeamMemberProducts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          TeamMemberProducts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(TeamMemberProducts).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/TeamMemberProducts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/TeamMemberProducts')
        .send({
          name: 'New TeamMemberProduct',
          info: 'This is the brand new TeamMemberProduct!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTeamMemberProduct = res.body;
          done();
        });
    });

    it('should respond with the newly created TeamMemberProduct', function() {
      expect(newTeamMemberProduct.name).to.equal('New TeamMemberProduct');
      expect(newTeamMemberProduct.info).to.equal('This is the brand new TeamMemberProduct!!!');
    });
  });

  describe('GET /api/TeamMemberProducts/:id', function() {
    var TeamMemberProduct;

    beforeEach(function(done) {
      request(app)
        .get(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          TeamMemberProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      TeamMemberProduct = {};
    });

    it('should respond with the requested TeamMemberProduct', function() {
      expect(TeamMemberProduct.name).to.equal('New TeamMemberProduct');
      expect(TeamMemberProduct.info).to.equal('This is the brand new TeamMemberProduct!!!');
    });
  });

  describe('PUT /api/TeamMemberProducts/:id', function() {
    var updatedTeamMemberProduct;

    beforeEach(function(done) {
      request(app)
        .put(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
        .send({
          name: 'Updated TeamMemberProduct',
          info: 'This is the updated TeamMemberProduct!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTeamMemberProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTeamMemberProduct = {};
    });

    it('should respond with the updated TeamMemberProduct', function() {
      expect(updatedTeamMemberProduct.name).to.equal('Updated TeamMemberProduct');
      expect(updatedTeamMemberProduct.info).to.equal('This is the updated TeamMemberProduct!!!');
    });

    it('should respond with the updated TeamMemberProduct on a subsequent GET', function(done) {
      request(app)
        .get(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let TeamMemberProduct = res.body;

          expect(TeamMemberProduct.name).to.equal('Updated TeamMemberProduct');
          expect(TeamMemberProduct.info).to.equal('This is the updated TeamMemberProduct!!!');

          done();
        });
    });
  });

  describe('PATCH /api/TeamMemberProducts/:id', function() {
    var patchedTeamMemberProduct;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched TeamMemberProduct' },
          { op: 'replace', path: '/info', value: 'This is the patched TeamMemberProduct!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTeamMemberProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTeamMemberProduct = {};
    });

    it('should respond with the patched TeamMemberProduct', function() {
      expect(patchedTeamMemberProduct.name).to.equal('Patched TeamMemberProduct');
      expect(patchedTeamMemberProduct.info).to.equal('This is the patched TeamMemberProduct!!!');
    });
  });

  describe('DELETE /api/TeamMemberProducts/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when TeamMemberProduct does not exist', function(done) {
      request(app)
        .delete(`/api/TeamMemberProducts/${newTeamMemberProduct._id}`)
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
