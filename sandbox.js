var productions = require("./lib/productions");

productions.all(function(err,result){
  console.log(result.length + " productions");
});

productions.findById(1, function(err,result){
  console.log(result);
});