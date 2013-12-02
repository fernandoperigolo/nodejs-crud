// Required Modules
var express = require('express');
var mongoq = require('mongoq');

// Setting up MongoDB and our Collection
var COLLECTION = 'user_collection';
var DB = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var db = mongoq(DB, {safe: false});
var collection = db.collection(COLLECTION);

// Starting Express
var app = express();

// Defining what express resources we will use
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// Enabling Cross Domain
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Basic home route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// POST route to insert new user
app.post('/user', function (req, res) {
  console.log(req);
  collection.insert({name: req.body.name, id: req.body.id}).done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});

// Get Route to get all user
app.get('/users', function (req, res) {
  collection.find().toArray().done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});

// GET route to get one user by passed ID
app.get('/user/:id', function (req, res) {
  // Get the passing ID
  var id = req.params.id;
  // Preparing the consult params
  var params = { id: id };
  collection.findOne(params).done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});

// PUT route to edit a user by ID
app.put('/user', function (req, res) {
  // Get the passing ID
  var id = req.body.id;
  // Get the new name passed
  var newName = req.body.name;
  // Find by ID and set new name
  collection.update({id: id}, {$set: {name: newName} });
  // Returning
  res.json({ "updated": "true" });
});

// DELETE route to delete a user by ID
app.del('/user', function (req, res) {
  // Get the passing ID
  var id = req.body.id;
  // Removing
  collection.remove({id: id});
  res.json({ "deleted": "true" });
});


// Make server listen at port 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on " + port);
});