
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var mongoose = require("mongoose");
var app = module.exports = express.createServer();

var productions = require("./lib/productions");


var api = {
  getProductions : productions.all,
  getProduction : productions.findById,
  updateProduction : productions.save
}


var rocket = require("./lib/rocket.io")
  .listen(app, api);


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  //db = new Mongo('tekpub', new Server("localhost", Connection.DEFAULT_PORT, {}), {native_parser:true});
  mongoose.connect('mongodb://localhost/tekpub');  
});

app.configure('test', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  //db = new Mongo('tekpub_test', new Server("localhost", Connection.DEFAULT_PORT, {}), {native_parser:true});
  mongoose.connect('mongodb://localhost/tekpub');  
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  mongoose.connect('mongodb://localhost/tekpub');  
  //db = new Mongo('tekpub', new Server("localhost", Connection.DEFAULT_PORT, {}), {native_parser:true});
});

// Routes

//app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



