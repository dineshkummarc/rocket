var Rocket = function(){

  var _socket;
  var _repo = {};
  var _collections = [];

  var _start = function(){
    _socket = io.connect();
    _socket.on("message", _handleMessage);
    
    for(var i = 0; i < _collections.length; i++){
      console.log("Hi I'm "+ _collections[i]);
      _bob(_collections[i]);
    }
    
  };

  var _handleMessage = function(data){
    if(data.notify) $("#notifier").html(data.notify);
  };

  var _initCollection = function(modelName){
      console.log("Adding " + modelName);
      _collections.push(modelName);

  };

  var _bob = function(modelName){
  
    var templates = $("." + modelName + "ListTemplate");
    
    _socket.emit("collectionRequested", modelName, function(data){
      
      _repo[modelName] = data;

      for(var i = 0;i<templates.length; i++){
        var source = $(templates[i]).html();
        var template = Handlebars.compile(source);
        var containerTemplate = $(templates[i]).attr("id").replace("Template", "Container");
        var containerSelector = "#" + containerTemplate;
        var container = $(containerSelector).html(template({items : data}));
      
        container.on("click", "." + modelName + "-list .selector", function(evt){
          evt.preventDefault();
          //alert("hi");
          var id = $(evt.currentTarget).data("id");
          alert(id);
        });

      };
    });
  }

 return {
    initCollection : _initCollection,
    repo : _repo,
    start : _start
  }

}();

