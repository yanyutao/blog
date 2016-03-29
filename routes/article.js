/**
 * Created by 闫宇韬 on 2016/3/23 0023.
 */
var express = require('express');
var router = express.Router();//生成一个路由实例
var articleModel = require('../model/article');
var markdown = require('markdown').markdown;

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
 * 渲染页面
 */
router.get('/add',function(req,res){
    res.render('article/add',{article:{}});
});

/**
 * 添加文章
 */
router.post('/add',upload.single('img'),function(req,res){
    var article = req.body;

    //修改文章
    var _id = article._id;
    if(_id){//有值是表示修改
        //set要更新的字段
        var set = {title:article.title,content:article.content};
        if(req.file){//如果上传了文件，那么更新img
            set.img = '/upload/'+req.file.filename;
        }
        articleModel.update({_id:_id},{$set:set},function(err,article){
            if(err){
                req.flash('error','更新文章失败');
                return res.redirect('/');
            }else{
                req.flash('error','更新文章成功');
                return res.redirect('/');
            }
        });
    }else{

        if(req.file){//如果上传了文件，那么久更新img
            article.img = '/upload/'+req.file.filename;
        }
        //写
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
    }
});

//跳转详情页
router.get('/detail/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.locals.keyword = '';
        console.log(article)
        res.render('article/detail',{
            article:article
        });

    });

});

//删除此文章
router.get('/delete/:_id',function(req,res){
    articleModel.remove({_id:req.params._id},function(err){
        if(err){
            req.flash('error','删除失败');
            res.redirect('back');
        }else{
            req.flash('success','删除成功');
            res.redirect('/');
        }
    });
});

//跳转到修改文章页面
router.get('/update/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/add',{
            article:article
        });
    });

});

//记住
router.get('/list/:pageNum/:pageSize',function(req, res, next) {
    var pageNum = req.params.pageNum&&req.params.pageNum>0?parseInt(req.params.pageNum):1;
    var pageSize =req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
    var query = {};
    var searchBtn = req.query.searchBtn;
    var keyword = req.query.keyword;
    if(searchBtn){
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
        query['title'] = new RegExp(req.session.keyword,"i");
    }

    articleModel.count(query,function(err,count){
        articleModel.find(query).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:req.session.keyword,
                totalPage:Math.ceil(count/pageSize),
                articles:articles
            });
        });
    });

});

module.exports = router;
