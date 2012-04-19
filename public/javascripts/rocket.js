var Rocket = function(){

  var _socket;
  var _repo = {};
  var _collections = [];

  var _start = function(){
    _socket = io.connect();
    _socket.on("message", _handleMessage);
    _socket.on("connect", _renderConnected);    
    _socket.on("itemReady", _renderItemReady);
    _socket.on("itemUpdated", _renderUpdates);
  };

  var _notify = function(message){
    $("#notifier").html(message);
  }

  var _handleMessage = function(data){
    if(data.notify) _notify(data.notify);
  };

  var _compileTemplate = function(template){
    var source = template.html();
    compiled = Handlebars.compile(source);
    return compiled;
  };

  var _wireEvents = function(container){
    container.find(".rocket-form").each(_handleFormSubmission);
    container.find(".rocket-selector").each(_handleItemClick);
  }

  var _handleFormSubmission = function(){
    var container = $(this);
    container.on("submit", function(evt){
      evt.preventDefault();
      var form = $(evt.currentTarget);
      
      var action = form.attr("action");
      var data = form.serialize();

      _socket.emit("formSubmitted", {action: action, data: data});

    });
  };

  var _handleItemClick = function(){
    var container = $(this);
    container.on("click", function(evt){
      evt.preventDefault();
      
      var id = $(evt.currentTarget).data("id");
      var query = $(evt.currentTarget).attr("href");
      
      _socket.emit("itemRequested", {query: query, id: id});

    });
  }

  var _renderUpdates = function(data){
    _renderTemplatesByType("itemUpdated", data);
    _notify("Updated " + data);
  }

  var _renderItemReady = function(data){
    _renderTemplatesByType("itemReady", function($template, compiledTemplate){

      var id = $template.attr("id");
      var html = compiledTemplate({item : data});
      var $container = _getContainer(id);

      $container.html(html);
      _wireEvents($container);
    });
  }

  var _renderConnected = function(){
    _renderTemplatesByType("connected", function($template, compiledTemplate){

      var query = $template.data("query");
      var container = _getContainer(query);

      _socket.emit("collectionRequested", query, function(data) {
        
        var html = compiledTemplate({items : data});
        container.html(html);
        _wireEvents(container);

      });
    });
      
  }

  var _renderTemplatesByType = function(type, fn){
    var templates = $("script[data-events^='" + type + "']");

    for(var i = 0;i<templates.length; i++){
      var $template = $(templates[i]);
      var compiledTemplate = _compileTemplate($template);
      fn($template, compiledTemplate);
    };
  }

  var _getContainer = function(id){
    var containerName = "#" + id + "Container";
    var container = $(containerName);
    return container;
  }

 return {
    start : _start
  }

}();
$().ready(function(){
  Rocket.start();
});
