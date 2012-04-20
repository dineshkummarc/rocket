
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
      socket.json.send({info : "Connected"});

      socket.on("rocketEvent", function(data, fn){

        var eventName = data.eventName;
        var eventToFire = eventName+"Ready";

        
        if(data.data){
          api[eventName](data.data, function(err, result){
            if(err)  socket.json.send({alert : "Error: " + err});
            else {
              socket.emit(eventToFire,{item : result, eventName :eventToFire});
              socket.json.send({info : "Item Updated"});
            }
            
            if(data.broadcastEvent){
              api[data.broadcastEvent](function(err,result){
                socket.emit(data.broadcastEvent + "Ready",{items : result, eventName :data.broadcastEvent + "Ready"} );
                socket.broadcast.emit(data.broadcastEvent + "Ready",{items : result, eventName :data.broadcastEvent + "Ready"} );
              });
            }
          });
        }else{
          api[eventName](function(err, result){
            if(err) socket.json.send({alert : "Error: " + err});
            else socket.emit(eventToFire,{items : result, eventName :eventToFire})
          });
        }

      });

    });
    return this;
  };

};

util.inherits(Rocket, events.EventEmitter);
var returns = new Rocket();
//console.log(returns);
module.exports = returns;
