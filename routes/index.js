var express = require('express');
var router = express.Router();
// 引入mysql 模块
var mysql = require('mysql');

// 创建连接
const connection = mysql.createConnection({
  host: 'localhost', // 主机名
  user: 'root', // 用户名
  password: 'root', // 密码
  database: 'admin' // 数据库的名字
});

// 调用数据库方法
connection.connect(()=>{
  console.log('数据库链接成功!');
});




/* GET home page. */
router.post('/', function (req, res) {
  res.send("1");
});

module.exports = router;