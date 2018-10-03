// 引入 express 模块
var express = require('express');
var router = express.Router();
// 引入mysql 模块
var mysql = require('mysql');

// 创建 连 接 数 据 库
const connection = mysql.createConnection({
  host:'localhost', // 主机名
  user:'root', //用户名
  password:'root', // 密码
  database:'users' // 数据库的名字
});

// 调用数据可方法
connection.connect(() => {
  console.log('商品数据库链接成功!');
});


// 接收 前端发来的 保存 商品分类的 post 请求
router.post('/goodstype', (req, res) => {
  // res.send('0120210');
  // 接收前端发来的数据
  let {goodType, typeName, state} = req.body;
  // console.log(goodType, typeName, state);
  // 定义mysql 命令
  let sqlCommand = `insert into goodstype(goodType, typeName, state) value(?, ?, ?)`
  // 参数
  let sqlParams = [goodType, typeName, state];
  // 执行sql语句(插入数据-添加商品的分类)
  connection.query(sqlCommand, sqlParams, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode': 1, 'msg':'添加成功!'});
      } else {
        res.send({'errcode': 0, 'msg':'添加失败!'});
      }
    }
  })
})

// 接收前端的 获取 商品分类的 get 请求
router.get('/typeList',(req, res) => {
  // res.send('100132165');
  // 定义mysql 查询 命令
  let sqlCommand = `select * from goodstype order by ctime desc`;
  // 执行 查询命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      res.send(data);
    }
  })
})

// 接收 获取商品分类的请求
router.post('/goodGenre', (req, res) => {
  // 接收前端发来的参数
  let { goodType } = req.body;
  // 定义SQL 查询命令
  let sqlCommand = `select * from goodstype where goodType = '${ goodType }' and state = "启用"`
  // 执行 sql 命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      res.send(data);
    }
  })
})

// 接收 保存 商品数据 的 post
router.post('/goodsAdd', (req, res) => {
  // res.send('案例是看得见法兰卡士大夫');
  // 接收传来的参数
  let { id, ctime, goodType, goodGenre, barCode, goodsName, goodsBid, marketValue, goodsPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc } = req.body;
  // // 判断 数据是否存在
  // // 定义SQL 查询命令
  // let sqlCommand1 = `select * from goodslist where barCode='${barCode} and goodsName='${goodsName} and unit='${unit}' and discount='${discount} and promotion='${promotion}'`;
  // // 开始查询
  // connection.query(sqlCommand1, (err, data) => {
  //   if(err){
  //     throw err;
  //   } else {
  //     console.log(data)
  //   }
  // })

  // 定义sql 保存数据命令
  let sqlCommand = `insert into goodslist(id, ctime, goodType, goodGenre, barCode, goodsName, goodsBid, marketValue, goodsPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc) value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  // 传入参数
  let sqlParams = [ id, ctime, goodType, goodGenre, barCode, goodsName, goodsBid, marketValue, goodsPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc ];
  // 执行sql 命令
  connection.query(sqlCommand, sqlParams, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode': 1, 'msg': '商品信息保存成功!'})
      } else {
        res.send({'errcode': 0, 'msg': '商品信息保存失败!'})
      }
    }
  })
})

module.exports = router;
