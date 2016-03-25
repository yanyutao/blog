var express = require('express');
//路径模块
var path = require('path');
//网站图标模块
var favicon = require('serve-favicon');
//日志模块
var logger = require('morgan');
//cookie模块
var cookieParser = require('cookie-parser');
//请求体模块
var bodyParser = require('body-parser');

//引入路由模块
var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/article');

//express会话模块 并存入数据库
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);//默认es6 设置es5

var app = express();

//设置模块引擎
app.set('views', path.join(__dirname, 'views'));//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'html');//设置视图模板引擎为 ejs。
//设置一下对于html格式的文件，渲染的时候委托ejs的渲染方面来进行渲染
app.engine('html',require('ejs').renderFile);

//使用了回话中间件之后，req.session
//引入此模块
var mongoose =  require('mongoose');
mongoose.connect('mongodb://mingkong:mingkong@127.0.0.1:27017/blog');
app.use(session({
  secret: '123456',//加密秘钥
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },//设置cookie安全性 false显示cookie
  //指定保存的位置
  store:new MongoStore({mongooseConnection:mongoose.connection})
}));
//成功失败提示
var flash =require('connect-flash');
//flash依赖session
app.use(flash());

//配置模板中间件，记录注册后的req.session.user
app.use(function(req,res,next){
  //res.locals才是真正的渲染模块
  res.locals.user = req.session.user;
  //添加成功和失败 flash取出来的是个数组
  res.locals.success = req.flash('success').toString();//转成字符串
  res.locals.error = req.flash('error').toString();
  next();
})


//模块加载完毕后，使用中间件
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));设置/public/favicon.ico为favicon图标。
//加载日志
app.use(logger('dev'));
//加载解析json
app.use(bodyParser.json());
//加载解析urlencoded请求体的中间件。
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public文件夹为存放静态文件的目录。
app.use(express.static(path.join(__dirname, 'public')));

//使用路由，中间件
app.use('/', routes);
app.use('/users', users);
app.use('/article', articles);


// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境下的错误处理
// 将打印出堆栈信息
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产环境下的错误处理
// 不向用户暴露堆栈信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//导出app供 bin/www 使用
module.exports = app;
