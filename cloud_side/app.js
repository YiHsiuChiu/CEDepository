require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var registerRouter_hantek = require('./routes/register_hantek');
var searchRouter = require('./routes/search');
var searchRouter_hantek = require('./routes/search_hantek');
var gatewayRouter = require('./routes/gateway');
var gatewayRouter_hantek = require('./routes/gateway_hantek');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/register_hantek', registerRouter_hantek);
app.use('/search', searchRouter);
app.use('/search_hantek', searchRouter_hantek);
app.use('/gateway', gatewayRouter);
app.use('/gateway_hantek', gatewayRouter_hantek);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
