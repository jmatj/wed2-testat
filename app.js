var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var nedbStore = require('express-nedb-session')(session);
var hbs = require('hbs');
var configController = require('./controller/configController.js');

var index = require('./routes/index');
var createEditNote = require('./routes/createEditNote');

var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});
hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: '1LQkBqg3kE9Aw9Svvivwb6nXTmmOs',
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/',
    httpOnly: true,
    maxAge: 24 * 3600  // One day
  },
  store: new nedbStore({ filename: 'data/session.db' })
}));

app.use(function(req, res, next) {
  configController.getStyleConfig(req, function(style) {
    res.locals.themeStyle = style;
  });
  next();
});

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/note', createEditNote);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
