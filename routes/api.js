/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, myDataBase) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      myDataBase.collection('books').find().toArray((err, docs) => {
        if (err) throw err;
        for(var i in docs){
          docs[i].commentcount = docs[i].comments.length
        }
        return res.json(docs)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title){
        return res.json("missing required field title")
      }
      //response will contain new book object including atleast _id and title
      myDataBase.collection('books').insertOne({title: title, comments: []}, (err, doc) => {
            if (err) {
              throw err;
            } else {
              return res.json(doc.ops[0])
            }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      myDataBase.collection('books').deleteMany({}, function(err, doc) {
        if (err) throw err;
        if(doc.deletedCount){
          return res.json("complete delete successful")
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(!ObjectID.isValid(bookid))
        return res.json('no book exists')
      myDataBase.collection('books').findOne({_id: ObjectID(bookid)}, (err, doc) => {
        if (err) throw err
        if(doc){
          return res.json(doc)
        }else{
          return res.json('no book exists')
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        return res.json('missing required field comment')
      }
      //json res format same as .get
      if(!ObjectID.isValid(bookid))
        return res.json('no book exists')
      myDataBase.collection('books').findOneAndUpdate({'_id': ObjectID(bookid)}, {$push: {comments: comment}}, {returnOriginal: false}, function(err, doc) {
        if (err) throw err;
        if(doc.value){
          return res.json(doc.value)
        } else {
          return res.json('no book exists')
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!ObjectID.isValid(bookid))
        return res.json('no book exists')
      myDataBase.collection('books').deleteOne({'_id': ObjectID(bookid)}, function(err, doc) {
        if (err) throw err;
        if(doc.deletedCount){
          return res.json('delete successful')
        } else {
          return res.json('no book exists')
        }
      });
    });
  
};
