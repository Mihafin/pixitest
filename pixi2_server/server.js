//
// PORT=8081 /Users/mihail/node_js/bin/node /Users/mihail/projs/pixi/pixi2_server/server.js
//

var port = process.env.PORT;
var env = process.env.ENV || 'local_dev';

var requirejs = require('requirejs');
//requirejs.config({
//    nodeRequire: require
//});

var http = requirejs("http");
var application = requirejs('application');
var app_params = requirejs('../pixi2/js/app/app_params');

application.init(env, app_params);

http.createServer(application.process_request.bind(application)).listen(port);

console.log('Server for ' + env + ' running at http://127.0.0.1:'+port+'/', true);



