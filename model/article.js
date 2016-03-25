//引入此模块
var mongoose =  require('mongoose');

//链接数据库
/*var db =  */
//mongoose.connect('mongodb://mingkong:mingkong@127.0.0.1:27017/blog');

//定义模型，确定数据库里面表接口
var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    img:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},//引用的模型是user
    //发表日期，类型date,默认值是now
    createAt:{type:Date,default:Date.now}
});

//定义数据model
var articleModel = mongoose.model('article',articleSchema);

module.exports = articleModel;