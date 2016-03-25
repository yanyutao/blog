/**
 * Created by 闫宇韬 on 2016/3/23 0023.
 */
var express = require('express');
var router = express.Router();//生成一个路由实例
var articleModel = require('../model/article');

var multer = require('multer');
//制定文件元素的存储方式
var storage = multer.diskStorage({
    //保存的目标
    destination: function (req, file, cb) {
        cb(null, '../public/upload');
    },
    //制定保存的文件名
    filename: function (req, file, cb) {
        console.error(file);
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }

})
var upload = multer({ storage: storage });
console.log(upload)

/**
 * 获取添加的文章
 */
router.get('/add',function(req,res){
    res.render('article/add',{})
});

/**
 * 提交数据 里面放置的是文件与的名字
 */
router.post('/add',upload.single('img'),function(req,res){
    var article = req.body;
    //写
    if(req.file){
        article.img = '/upload/'+req.file.filename;
    }
    var user = req.session.user;
    article.user = user; //保存的是个对象，但保存到数据中是字符串
    articleModel.create(article,function(err,article){
        if(err){
            req.flash('error','发表文章失败');
            return res.redirect('/');
        }else{
            req.flash('error','发表文章成功');
            return res.redirect('/');
        }
    });

});

module.exports = router;
