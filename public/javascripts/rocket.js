var Rocket = function(){

  var _socket;
  var _repo = {};
  var _collections = [];
  var _eventList = [];

  var _events = function(list){
    _eventList = list;
  };


  var _start = function(fireEvent){
    _socket = io.connect();
    _socket.on("message", _handleMessage);
    //_socket.on("connect", _renderConnected);    
    //_socket.on("itemReady", _renderItemReady);
    //_socket.on("itemUpdated", _renderUpdates);
    for (var ev in _eventList) {
      _socket.on(ev, _renderTemplate)
    };

    if(fireEvent){
      _socket.emit("rocketEvent",{eventName : fireEvent});
    }

  };
  var _renderTemplate = function(data){
    //the eventName is returned to us
    //look up in the list
    var templateName = _eventList[data.eventName];

    console.log(data.items);
    var containerName = templateName.replace("Template","Container");
    console.log(containerName);

    if(!templateName){
      console.log("Can't find a template with the name " + templateName);
    }
    var template = $("#" + templateName);
    var container = $("#" + containerName);

    if(container.length === 0){
      console.log("Looking for " + containerName + " and can't find it...");
    }
    
    //so render already!
    var compiled = _compileTemplate(template);
    container.html(compiled(data));
    
    //and wire the events
    _wireEvents(container);
  }

  var _handleMessage = function(data){
    console.log(data);
    $notifier = $("#notifier");
    if(data.info){
      $notifier.html(data.info);
      $notifier.attr("class","alert alert-info");
    }else if(data.warn){
      $notifier.html(data.warn);
      $notifier.attr("class","alert alert-warn");
    }else if(data.alert){
      $notifier.html(data.alert);
      $notifier.attr("class","alert alert-error");     
    }
    //if(data.notify) 
    //else if (data.warn) _warn()
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
      var data = _serializeObject(form);
      var broadcastEvent = form.data("broadcast");
      
      _socket.emit("rocketEvent", {eventName: action, data: data, broadcastEvent : broadcastEvent});

    });
  };
  var _serializeObject = function(form)
  {
     var o = {};
     var a = form.serializeArray();
     $.each(a, function() {
         if (o[this.name]) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
  };
  var _handleItemClick = function(){
    var container = $(this);
    container.on("click", function(evt){
      evt.preventDefault();
      
      var id = $(evt.currentTarget).data("id");
      var query = $(evt.currentTarget).attr("href");
      
      _socket.emit("rocketEvent", {eventName: query, data: id});

    });
  }

  var _renderUpdates = function(data){
    _notify("Updated " + data);
    alert('update');
  }

  var _renderItemReady = function(data){
    _renderTemplatesForObject({data: data});
  }

  var _renderConnected = function(){
    _renderTemplatesForEvent("connected");
  }

  var _renderTemplatesForObject = function(options){
    var templates = $("script[data-events^='itemReady']");
    _renderTemplates(templates, options, function($template, compiledTemplate){
      _handleIdTemplates($template, compiledTemplate, options);
    });
  }

  var _renderTemplatesForEvent = function(eventName, options){
    var templates = $("script[data-events^='" + eventName + "']");
    _renderTemplates(templates, options, function($template, compiledTemplate){
      _handleQueryTemplates($template, compiledTemplate, options);
    });
  }

  var _renderTemplates = function(templates, options, fn){
    for(var i = 0;i<templates.length; i++){
      var $template = $(templates[i]);
      var compiledTemplate = _compileTemplate($template);
      fn($template, compiledTemplate);
    };
  }

  var _handleIdTemplates = function($template, compiledTemplate, options){
    options = options || {};
    var id = $template.attr("id");
    if (!id){ return; }

    var $container = _getContainer(id);

    var html = compiledTemplate({item: options.data});
    $container.html(html);
    _wireEvents($container);
  }

  var _handleQueryTemplates = function($template, compiledTemplate){
    var query = $template.data("query");
    if (!query){ return; }

    _socket.emit("collectionRequested", query, function(data) {
      
      var html = compiledTemplate({items : data});
      var container = _getContainer(query);
      container.html(html);
      _wireEvents(container);

    });
  }

  var _getContainer = function(id){
    var containerName = "#" + id + "Container";
    var container = $(containerName);
    return container;
  }

 return {
    start : _start, 
    hookupEvents : _events
  }

}();

