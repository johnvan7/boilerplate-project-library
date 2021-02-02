/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
var aBookId;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({title: 'A book title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'title');
          assert.equal(res.body.title, 'A book title');
          assert.property(res.body, '_id');
          aBookId = res.body._id
          done()
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.isArray(res.body);
          res.body.forEach((book) => {
            assert.isObject(book);
            assert.property(book, 'title');
            assert.isString(book.title);
            assert.property(book, '_id');
            assert.property(book, 'commentcount');
            assert.isNumber(book.commentcount);
          });
          done()
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done()
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+aBookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'title');
          assert.isString(res.body.title);
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          done()
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+aBookId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({comment: 'This book is fab!'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          res.body.comments.forEach(comment => {
            assert.isString(comment);
            assert.oneOf(comment, ['This book is fab!'])
          })
          done()
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/'+aBookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'missing required field comment');
          done()
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/5f665eb46e296f6b9b6a504d')
        .send({comment: 'This book is fab!'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done()
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+aBookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'delete successful');
          done()
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done()
        })
      });

    });

  });

});
