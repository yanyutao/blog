var crypto = require('crypto');
var s = crypto.createHmac('md5','salt')
    .update('hello').digest('hex');

console.log(s)