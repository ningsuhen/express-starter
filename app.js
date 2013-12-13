/**
 * Module dependencies.
 */
var express = require('express')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
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
  console.log("hello")
  // compile LESS files to css
  app.use(require('less-middleware')({
    src : __dirname + '/public/',
    paths : [ __dirname + '/bower_components/bootstrap/less/' ],
    compress : true
  }));
  // compile underscore templates to single JST File
  var jst = require('jst');
  jst.compiler = 'underscore';
  jst.compile(__dirname + '/public/tpl', __dirname + '/public/js', function() {
    return console.log('recompiled to /public/js/templates.js');
  });

  // Combine javascript files to single file
  var assetManagerGroups = {
    'vendorjs' : {
      'route' : /\/js\/vendors.min.js/,
      'path' : __dirname + '/bower_components/',
      'dataType' : 'javascript',
      'files' : [ 'jquery/jquery.min.js', 'underscore/underscore-min.js',
          'modernizr/modernizr.js', 'backbone/backbone-min.js',
          'bootstrap/dist/js/bootstrap.min.js' ]
    },
    'mainjs' : {
      'route' : /\/js\/main.min.js/,
      'path' : __dirname + '/public/js/',
      'dataType' : 'javascript',
      'files' : [ 'plugins.js', 'templates.js', 'main.js' ]
    },
  // 'css' : {
  // 'route' : /\/static\/css\/[0-9]+\/.*\.css/,
  // 'path' : './public/css/',
  // 'dataType' : 'css',
  // 'files' : [ 'main.css', 'style.css' ],
  // 'preManipulate' : {
  // // Regexp to match user-agents including MSIE.
  // 'MSIE' : [ assetHandler.yuiCssOptimize, assetHandler.fixVendorPrefixes,
  // assetHandler.fixGradients, assetHandler.stripDataUrlsPrefix ],
  // // Matches all (regex start line)
  // '^' : [ assetHandler.yuiCssOptimize, assetHandler.fixVendorPrefixes,
  // assetHandler.fixGradients,
  // assetHandler.replaceImageRefToBase64(root) ]
  // }
  // }
  };
}
var assetsManagerMiddleware = assetManager(assetManagerGroups);
app.use(assetsManagerMiddleware);
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
