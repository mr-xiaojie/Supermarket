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
connection.connect(() => {
  console.log('数据库链接成功!');
});

/* 接受前台发送的 post 请求 */
router.post('/userAdd', function (req, res) {
  // 获得 前台发送 的 参数
  let {username, password, region} = req.body;
  console.log([username, password, region]);
  //定义 数据库命令
  let sqlCommand = 'insert into users(username, password, groups) values(?, ?, ?)';
  // 接受的参数
  let sqlParams = [username, password, region];
  //res.send([username, password, region]);
  console.log(sqlParams);
  //执行sql 命令(插入数据 添加账号)
  connection.query(sqlCommand, sqlParams, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 否则 检查是否插入成功
      // 判断 如果受影响的行数 > 0 就是插入成功了
      // affectedRows 受影响的行数
      if (data.affectedRows > 0) {
        res.send({
          "errcode": 1,
          "msg": "添加成功123!"
        });
      } else {
        res.send({
          "errcode": 0,
          "msg": "添加失败!"
        });
      }
    }
  })

});

// 接受 浏览器的 get 请求
router.get('/userList', (req, res)=>{
  // 定义数据查询语句
  let sqlCommand = 'select * from users order by ctime desc';

  // 数据库万能方法
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err
    }else{
      res.send(data);
    }
  })
});


// 接受前端发送的 删除单条 用户信息的 get 请求
router.get('/deleteOne', (req, res) => {
  //res.send('123456');
  // 前端发送的 参数
  let {id} = req.query;
  console.log(id);
  // 定义mysql 查询命令
  let sqlCommand = `delete from users where id = ${id}`

  // 执行数据库方法
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode':1, 'msg':'删除成功!'})
      } else {
        res.send({'errcode':0, 'msg':'删除失败!'})
      }
    }
  })
});

// 接受前端发送的 修改 用户信息的 get 请求
router.get('/userEdit', (req, res) => {
  // res.send('021222');
  //接受 前端发送的参数
  let {id} = req.query;
  // 定义 数据库命令
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

// 接收 修改用户信息的 post 请求
router.post('/userEdit', (req, res) => {
  // 接收参数
  let {id, username, password, region} = req.body;
  // 定义 数据库命令
  let sqlCommand = `update users set password="${password}", groups="${region}" where id=${id}`;
  // 执行数据库方法
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode':1, 'msg':'修改成功!'})
      } else {
        res.send({'errcode':0, 'msg':'修改失败!'})
      }
    }
  })
})


module.exports = router;