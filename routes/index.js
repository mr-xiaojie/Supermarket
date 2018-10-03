var express = require('express');
var router = express.Router();
// 引入mysql 模块
var mysql = require('mysql');

// 创建连接
const connection = mysql.createConnection({
  host: 'localhost', // 主机名
  user: 'root', // 用户名
  password: 'root', // 密码
  database: 'users' // 数据库的名字
});

// 调用数据库方法
connection.connect(()=>{
  console.log('首页数据库链接成功!');
});




/* GET home page. */
router.post('/getuser', function (req, res) {
  //接受 前端发送的参数
  let {id} = req.body;
  // 定义 数据库命令
  console.log(id)
  let sqlCommand = `select * from users where id = ${id}`

  // 执行数据库方法
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err
    } else {
      res.send(data);
      // res.render('./userEdit.html', {'userEdit':data});
    }
  })
});

module.exports = router;
