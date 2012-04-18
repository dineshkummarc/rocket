
var events = require("events");
var util = require("util");

var Rocket = function(){
  var that = this;

  events.EventEmitter.call(this);
  
  this.listen = function(app){
    var io =require("socket.io").listen(app);  

    io.sockets.on("connection",function(socket){
      socket.json.send({notify : "Connected"});
      
      socket.on("collectionRequested", function(name, fn){
        that.emit("collectionRequested", {collectionName : name, returns : fn});  
      });

    });
    return this;
  };

};

util.inherits(Rocket, events.EventEmitter);
var returns = new Rocket();
//console.log(returns);
module.exports = returns;