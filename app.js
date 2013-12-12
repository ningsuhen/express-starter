/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
var jst = require('jst');
jst.compiler = 'underscore';
jst.compile(__dirname + '/public/tpl', __dirname + '/public/js', function () {
    return console.log('recompiled to /public/js/templates.js');
});

var app = express();

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
app.use(require('less-middleware')({
    src : __dirname + '/vendor/twitter/bootstrap/less',
    dest : __dirname + '/public',
    prefix : '/css',
    compress : true
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// app.configure('development', function () {
// app.use(express.errorHandler({
// dumpExceptions : true,
// showStack : true
// }));
// });

// app.configure('production', function () {
// app.use(express.errorHandler());
// });

// Compatible

// Routes

// app.get('/', routes.index);
//
// app.listen(3000, function () {
// console.log("Express server listening on port %d in %s mode",
// app.address().port, app.settings.env);
// });
