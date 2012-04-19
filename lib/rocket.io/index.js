
var events = require("events");
var util = require("util");

var Rocket = function(){
  var that = this;
  var _api;
  events.EventEmitter.call(this);
  
  this.listen = function(app, api){
    
    var io =require("socket.io").listen(app);  
    _api = api;

    io.sockets.on("connection",function(socket){
      socket.json.send({notify : "Connected"});
      
      socket.on("collectionRequested", function(name, fn){
        fn(_api[name]());
      });

      socket.on("itemRequested", function(data){
        var item = _api[data.query](data.id)
        socket.emit("itemReady", item);
      });

      socket.on("formSubmitted", function(form, fn){
        var data = _api[form.action](form.data);
        socket.emit("itemUpdated", data);
      });

    });
    return this;
  };

};

util.inherits(Rocket, events.EventEmitter);
var returns = new Rocket();
//console.log(returns);
module.exports = returns;
