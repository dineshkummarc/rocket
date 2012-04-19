var Rocket = function(){

  var _socket;
  var _repo = {};
  var _collections = [];


  var _start = function(){
    _socket = io.connect();
    _socket.on("message", _handleMessage);
    _socket.on("connect", _renderConnected);    
    _socket.on("itemReady", _renderItemReady);
  };

  var _notify = function(message){
    $("#notifier").html(message);
  }

  var _handleMessage = function(data){
    if(data.notify) _notify(data.notify);
  };

  var _compileTemplate = function(id){

      var source = $(id).html();
      return Handlebars.compile(source);
  };

  var _handleFormSubmission = function(container){
    container.on("submit", function(evt){
      evt.preventDefault();
      var form = $(evt.currentTarget);
      
      var action = form.attr("action");
      var data = form.serialize();

      _socket.emit("formSubmitted", {action: action, data: data}, function(data){
        _notify("Form posted " + data);
      });

    });
  };

  var _wireEvents = function(container){
    var $form = container.find(".rocket-form");
    if($form.length > 0) _handleFormSubmission($form);

    var $link = container.find(".rocket-selector");
    if($link.length > 0) _handleItemClick($link);
  }

  var _handleItemClick = function(container){
    //load up the click events
    container.on("click", function(evt){
      evt.preventDefault();
      
      var id = $(evt.currentTarget).data("id");
      var query = $(evt.currentTarget).attr("href");
      
      _socket.emit("itemRequested", {query: query, id: id});

    });
  }

  var _renderItemReady = function(data){
    var templates = $("script[data-events^='itemReady']");
    for(var i = 0;i<templates.length; i++){
      var id = $(templates[i]).attr("id");
      var containerName = "#" + id + "Container";

      var compiledTemplate = _compileTemplate(templates[i]);
      var container = $(containerName).html(compiledTemplate({item : data}));
      _wireEvents(container);
    };
  }

  var _renderConnected = function(){
    var templates = $("script[data-events^='connected']");
      
    for(var i = 0;i<templates.length; i++){
      
      var query = $(templates[i]).data("query");
      var containerName = query + "Container";

      var compiledTemplate = _compileTemplate(templates[i])

      _socket.emit("collectionRequested", query, function(data) {
        
        var container = $("#" + containerName).html(compiledTemplate({items : data}));
        _wireEvents(container);

      });
    };

  }

 return {
    start : _start
  }

}();
$().ready(function(){
  Rocket.start();
});
