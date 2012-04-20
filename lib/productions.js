var mongoose = require("mongoose");
var Production = function(){
  var mongoose = require('mongoose');
  var Schema = require('mongoose').Schema;
  var summaryFields = {
    slug              :   1, 
    title             :   1, 
    description       :   1, 
    price             :   1, 
    status            :   1, 
    released_at       :   1, 
    youtube_preview   :   1,
    slide             :   1,
    thumb             :   1,
    link              :   1,
    preview           :   1,
    tags              :   1
  };

  var productionSchema = new Schema({
    id            : Number,
    slug          : {type : String, index: { unique: true, required : true } },
    title         : {type : String, index: { required : true } },
    description   : String,
    status        : String,
    production_type: String,
    notes         : String,
    author        : String,
    default_height : Number,
    default_width : Number,
    price         : Number,
    released_at   : Date,
    ipad_enabled  : Boolean,
    downloadable  : Boolean,
    full_download : Boolean,
    created_at    : Date,
    updated_at    : Date,
    custom_page   : String,
    youtube_preview:String,
    episodes      : Array,
    tags          : Array
  });
  
  var _model = mongoose.model('Production', productionSchema);
  
  var _summary = function(callback){
    _model.find({status:"released"}, summaryFields, callback);
  };

  var _all = function(callback){
    _model.find({},callback);
  };

  var _findBySlug = function(slug, callback){
    _model.findOne({slug : slug}, callback);
  };
  var _findById = function(id, callback){
    _model.findOne({id : id}, callback);
  };

  var _save = function(data, callback){
    console.log(data);
    _model.findOne({id : data.id}, function(err,p){
      p.title = data.title,
      p.price = data.price
      p.save();
      callback(null,p);
    });
  };

  return {
    findBySlug  : _findBySlug,
    findById    : _findById,
    all         : _all,
    summary     : _summary,
    model       : _model,
    save        : _save
  };

}();
module.exports = Production;