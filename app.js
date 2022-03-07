import { loader } from './load_route.js';
//这里需要将database类挂载在全局对象下，以便查找
import Database from "./modules/database/mysql.js"
const database = new Database();
global.database = database;
//因为使用了node的版本大于14,所以需要手动导入require才可以使用CommonJs模块引用
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const loadRoute = loader

var app = express();
global.__dirname = path.resolve();
// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

loadRoute(app, path.join(path.resolve(), 'controllers'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, '0.0.0.0', console.log("application is start at port 3000"))
export default app;
