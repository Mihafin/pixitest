define(function(){
    //var url = require("url");
    //var path = require('path');

    function Application(){
        this.log("app created!");
    };

    Application.prototype.log = function(){
        console.log.apply(console, arguments);
    };

    Application.prototype.init = function(env, app_params){
        this.app_params = app_params;
        this.env = env;
        this.log("app int!", app_params);
    };

    Application.prototype.process_request = function(request, response){
        this.log("app process_request", this.env);
    };

    return new Application();
});

//var pg = require("pg");
//function onRequest(request, response) {
//
//    application.process_request(request, response);
//
//    require('./application').process_request(request, response);

//var pathname = url.parse(request.url).pathname;
//var filename = path.join(process.cwd(), pathname);
//var ext = path.extname(filename).split(".")[1];
//
//console.log("Request for " + filename + " received.");
//
//
//
//response.writeHead(200, {"Content-Type": "text/plain"});
//response.write("command");
//response.end();
//}