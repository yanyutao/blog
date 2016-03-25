var express = require('express');
var router = express.Router();//生成一个路由实例
var articleModel = require('../model/article');//引入文章模型
var markdown = require('markdown').markdown;
/* GET home page. */
router.get('/', function(req, res, next) {
  //从session中获取用户信息
  //第二个参数对象最后会合并到res.locals对象上，并渲染模板
  //先配置参数，然后在执行查询
  //我们查出来的user是ID,需要通过坡populate转成对象
  articleModel.find().populate('user').exec(function(err,articles){
    if(err){
      req.flash('error',error);
      res.redirect();
    }
    articles.forEach(function(article){
      article.content = markdown.toHTML(article.content);
    });
    res.render('index',{articles:articles})
  });
  //res.render('index', {});//获取用户已经登录,注册成功的时候存入到req.session.user中
});

module.exports = router;
