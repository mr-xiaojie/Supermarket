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
  console.log('用户数据库链接成功!');
});

/* 接收前端的 登录用户验证 请求 */
router.post('/userLogin', (req, res) => {
  // 接收到的参数
  let { username, password } = req.body;
  // 定义 数据数查询命令
  let sqlCommand = `select * from users where username='${username}' and password='${password}'`;
  // 执行命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.length){
        // 登录成功 设置cookie (在res.send()之前设置)
        res.cookie('username', data[0].username) // 用户名
        res.cookie('userid', data[0].id) // id
        res.cookie('groups', data[0].groups) // 组别

        res.send({'errcode': 1, 'msg':'登录成功!'});
      } else {
        res.send({'errcode': 0, 'msg':'登录失败!用户名或密码错误!'});
      }
    }
  })
})

/* 接收浏览器退出登录请求 */
router.get('/signOut', (req, res) => {
  //清除cookie 数据
  res.clearCookie('username');
  res.clearCookie('userid');
  res.clearCookie('groups');
  res.send("<script> alert('退出登录喽!'); location.href='http://localhost:5151/login.html'; </script>");
})

/* 接收是否登录的请求 */
router.get('/isLogin',(req, res) => {
  console.log(req.cookies);
  if(req.cookies.username){
    res.send(`console.log("${req.cookies.username}")`);
  } else {
    res.send('alert("对不起!请登录账号");location.href="http://localhost:5151/login.html";');
  }

})

/* 接收前端发送的 验证 用户名是否存在的 post 请求 */
router.post('/ishave', (req, res) => {
  // 接收参数
  let { newName } = req.body;
  // 定义 数据库查询命令select * from Info where Code='p001'
  let sqlCommand = `select * from users where username='${ newName }'`;
  // 执行数据库命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      console.log(data.length);
      if(data.length){
        res.send({'errcode':1, 'msg':'用户名已存在!'});
      } else {
        res.send({'errcode':0, 'msg':''});
      }
    }
  })
})

/* 接受前台发送的添加用户的 post 请求 */
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
          "msg": "添加成功!"
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
/* router.get('/userList', (req, res)=>{
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
}); */
/* 接收前端get 获取 和 数据的 总条数 分页的 数据 */
router.get('/userList', (req, res) => {
  // 接收数据 barsNum  pagesNum
  let { barsNum, pagesNum } = req.query;
  console.log(barsNum, pagesNum)
  // 定义 数据库 查询 全部的命令
  let sqlCommand = 'select * from users'
  // 执行命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    }else{
      console.log(data.length)

      let allUsers = data.length; // 总条数

      let n = ( pagesNum - 1 ) * barsNum; // 要跳过得 数据条数
      // 定义 数据库 当页 数据
      sqlCommand += ` order by ctime desc limit ${n}, ${barsNum}`
      console.log(sqlCommand)
      connection.query(sqlCommand, (err, data) => {
        if(err){
          throw err
        }else {
          // 把数据的总条数 和 当前页码对应的数据 一起发送给前端
          res.send({"allUsers": allUsers, "pageData": data});
        }
      })
    }
  })
})


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
});

// 接收前台发送的 批量删除请求
router.post('/delUsers', (req, res) => {

  // 接收得到的 前端发来的 需要删除的用户 ID 数组
  let idArr = req.body['idArr[]'];

  // 定义 数据库命令
  let sqlCommand = `delete from users where id in (${idArr})`;
  // 执行数据库方法
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode':1, 'msg':'批量删除成功!'})
      } else {
        res.send({'errcode':0, 'msg':'批量删除失败!'})
      }

    }
  })
})


module.exports = router;
