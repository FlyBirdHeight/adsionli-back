import { loader } from './load_route.js';
//因为使用了node的版本大于14,所以需要手动导入require才可以使用CommonJs模块引用
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var os = require('os');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
//这里需要将database类挂载在全局对象下，以便查找
import Database from "./modules/database/mysql.js"
import { registerListener } from "./events/index.js"
import * as Mq from "./modules/mq/index.js"
import timerTaskStart from "./timer/start.js"
import FileSetting from "./modules/file/index.js"
import WorkerPool from "./workers/worker.js"
global.__dirname = path.resolve();

/**
 * README: 这里就把我们需要提前挂载或运行的对象实例化出来
 */
global.mq = Mq.default;
const database = new Database();
global.database = database;
global.eventListener = registerListener(path.join(path.resolve(), 'events'))
global.file = new FileSetting();
// global.threadPool = new WorkerPool();

timerTaskStart();

var app = express();
// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public'), {
  setHeaders: function (res, path, stat) {
    res.set('Access-Control-Allow-Origin', '*')
  }
}));
//NOTE: 动态路由生成
const loadRoute = loader
loadRoute(app, path.join(path.resolve(), 'controllers'));


global.netInfo = {
  ip: '127.0.0.1',
  host: 3000
}

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
app.use(cors())

app.listen(3000, '0.0.0.0', () => {
  console.log("项目启动成功，运行端口：3000")
})

export default app;
