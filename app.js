var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const ENV = process.env.NODE_ENV;
if (ENV !== 'prod') {
  app.use(logger('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const redisConn = require('./db/redis');
const sessionStore = new redisStore({
  client: redisConn
});
app.use(session({
  secret: 'wAdnjkaf*7ds27hs;dja)9asdfh^dahcnaak',
  cookie: {
    // path: '/',//默认配置
    // httpOnly: true,//默认配置
    maxAge: 24 * 60 * 60 * 1000,
  },
  name: 'sessionid',
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);


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

module.exports = app;
