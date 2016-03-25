//引入此模块
var mongoose =  require('mongoose');

//链接数据库
/*var db =  */
//mongoose.connect('mongodb://mingkong:mingkong@127.0.0.1:27017/blog');

//定义模型，确定数据库里面表接口

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
});


//定义数据model
var userModel = mongoose.model('user',userSchema);

module.exports = userModel;

