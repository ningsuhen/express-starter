/**
 * Module dependencies.
 */
var express = require('express')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();

// development only
if ('development' == app.get('env')) {
  // compile LESS files to css
  app.use(require('less-middleware')({
    src : __dirname + '/vendor/twitter/bootstrap/less',
    dest : __dirname + '/public',
    prefix : '/css',
    compress : true
  }));
  // compile underscore templates to single JST File
  var jst = require('jst');
  jst.compiler = 'underscore';
  jst.compile(__dirname + '/public/tpl', __dirname + '/public/js', function() {
    return console.log('recompiled to /public/js/templates.js');
  });
}
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

// production only
// if ('production' == app.get('env')) {
// app.set('db uri', 'n.n.n.n/prod');
// }

// app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
