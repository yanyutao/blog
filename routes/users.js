var express = require('express');
var router = express.Router();
//引入数据库模型
var userModel = require('../model/user');
var validate = require('../middle/index');
var crypto = require('crypto');
/*
req.query(处理 get 请求，获取查询字符串)
GET /index.html?name=zfpx
req.query.name  -> zfpx
req.params(处理 /:name 形式的 get 或 post 请求，获取请求参数)
// GET /user/zfpx
req.params.name -> zfpx
req.body(处理 post 请求，获取 post 请求体)
req.body.name
 */

/**
 * 用户注册 要求登录前才能访问
 */
router.get('/reg',validate.checkNotLogin,function(req,res){

  res.render('user/reg', { title: 'reg' });
});

/**
 *提交用户注册表单
 */
router.post('/reg',validate.checkNotLogin,function(req,res){
    var user = req.body;
    //头像赋值加密
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email);
    user.password =  md5(user.password);

    //创建文档
    userModel.create(user,function(err,doc){
        if(err){
            console.log(err);
            req.flash('error',err);
            res.redirect('back');//返回到上一个页面
        }else{
            //把保存及之后的用户放置到此用户回话的user属性
            req.session.user = doc;

            console.log(req.session.user)
            //增加一个成功的提示
            req.flash('success','注册成功');
            console.log(req.session)
            res.redirect('/');
        }
    });
});

/**
 * 显示用户登录表单
 */
router.get('/login',validate.checkNotLogin,function(req,res){
  res.render('user/login',{title:'登录'})
});

/**
 * 当用户提交登录信息处理
 */
router.post('/login',validate.checkNotLogin,function(req,res){
    var user = req.body;
    user.password =  md5(user.password);
    userModel.findOne(user,function(err,user){
        if(err){
            req.flash('error',err);
            res.redirect('back');//返回到上一个页面
        }else{
            //把保存及之后的用户放置到此用户回话的user属性
            req.session.user = user;
            req.flash('success','登录成功');
            res.redirect('/');
        }
    })
});

/**
 * 用户退出登录
 */
router.get('/logout',validate.checkLogin,function(req,res){
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;

function md5(str){

    return crypto.createHash('md5').update(str).digest('hex');//hex十六进制
}