/**
 * Module dependencies.
 */
var express = require('express')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var log4js = require('log4js');
var app = express();
app.conf = require('nconf');

// Configure Log4js
log4js.configure('config/log4js.json', {});
log4js.loadAppender('file');
logger = log4js.getLogger();

// Load configurations from settings.json and defaults.json
app.conf.argv().env().file({
  file : './config/settings.json'
}).defaults(require('./config/default-settings.json'));

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
app.set('port', app.conf.get('PORT') || 3000);
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

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
