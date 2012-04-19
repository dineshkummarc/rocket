
var events = require("events");
var util = require("util");

var Products = function(){

  events.EventEmitter.call(this);

  this.all = function(){
     return [
        {id:1, title:"Product 1", price : 12.00},
        {id:2, title:"Product 2", price : 11.00},
        {id:3, title:"Product 3", price : 15.00},
        {id:4, title:"Product 4", price : 12.00},
        {id:5, title:"Product 5", price : 18.00},
        {id:6, title:"Product 6", price : 22.00},
        {id:7, title:"Product 7", price : 19.00},
        {id:8, title:"Product 8", price : 34.00},
        {id:9, title:"Product 9", price : 111.00},
        {id:10, title:"Product 10", price : 88.00},
      ];
  };
  this.find = function(id){
    return {id : id, title : "Found thing", price:21.00}
  }
  this.save = function(data){
    data.title += "1";
    console.log(data);
    return data;
  }
};

util.inherits(Products,events.EventEmitter);

module.exports = new Products();
