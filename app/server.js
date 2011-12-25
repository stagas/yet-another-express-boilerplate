/*
 * Yaeb 0.1.0
 */

// Info

var name = 'Yaeb';
var version = '0.1.0';

// Dependencies

var path = require('path');
var express = require('express');

// Create server

var app = express.createServer();

// Export app

exports = module.exports = app;

// Settings

var settings = app.settings;
app.configure(function () {
  app.set('name', name);
  app.set('version', version);
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('secret', 'your secret');
});

// Middleware

app.configure('production', function () {
  app.use(express.logger());
});

app.configure('development', function () {
  app.use(express.logger('dev'));
});

app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.settings.secret));
  app.use(express.session({ secret: app.settings.secret }));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(function (req, res, next) {
    res.statusCode = 404;
    res.render('error', { title: '404 Not Found' });
  });
});

app.configure('development', function () {
  express.errorHandler.title = app.settings.name;
  app.use(express.errorHandler({
    'stack': true
  , 'dump': true
  }));
});

app.configure('production', function () {
  app.error(function (err, req, res, next) {
    console.error(err.stack);
    res.statusCode = 500;
    res.render('error', { title: '500 Server Error' });
  });
});

// Locals

app.locals(app.settings);
app.locals({
  title: undefined
});

// Dynamic helpers

app.dynamicHelpers({
  statusCode: function (req, res) { return res.statusCode; }
});

// Routes

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/titled', function (req, res) {
  res.render('index', { title: 'Titled' });
});

app.get('/throws', function (req, res) {
  throw new Error('Yup, it throws');
});
