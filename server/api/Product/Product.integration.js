/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProduct;

describe('Product API:', function() {
  describe('GET /api/Products', function() {
    var Products;

    beforeEach(function(done) {
      request(app)
        .get('/api/Products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Products = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Products).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/Products', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Products')
        .send({
          name: 'New Product',
          info: 'This is the brand new Product!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProduct = res.body;
          done();
        });
    });

    it('should respond with the newly created Product', function() {
      expect(newProduct.name).to.equal('New Product');
      expect(newProduct.info).to.equal('This is the brand new Product!!!');
    });
  });

  describe('GET /api/Products/:id', function() {
    var Product;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Products/${newProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Product = res.body;
          done();
        });
    });

    afterEach(function() {
      Product = {};
    });

    it('should respond with the requested Product', function() {
      expect(Product.name).to.equal('New Product');
      expect(Product.info).to.equal('This is the brand new Product!!!');
    });
  });

  describe('PUT /api/Products/:id', function() {
    var updatedProduct;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Products/${newProduct._id}`)
        .send({
          name: 'Updated Product',
          info: 'This is the updated Product!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProduct = {};
    });

    it('should respond with the updated Product', function() {
      expect(updatedProduct.name).to.equal('Updated Product');
      expect(updatedProduct.info).to.equal('This is the updated Product!!!');
    });

    it('should respond with the updated Product on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Products/${newProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Product = res.body;

          expect(Product.name).to.equal('Updated Product');
          expect(Product.info).to.equal('This is the updated Product!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Products/:id', function() {
    var patchedProduct;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Products/${newProduct._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Product' },
          { op: 'replace', path: '/info', value: 'This is the patched Product!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProduct = {};
    });

    it('should respond with the patched Product', function() {
      expect(patchedProduct.name).to.equal('Patched Product');
      expect(patchedProduct.info).to.equal('This is the patched Product!!!');
    });
  });

  describe('DELETE /api/Products/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Products/${newProduct._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Product does not exist', function(done) {
      request(app)
        .delete(`/api/Products/${newProduct._id}`)
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
