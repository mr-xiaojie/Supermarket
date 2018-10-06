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

// 接收 需要修改编辑的分类信息id
router.get('/typeEdit', (req, res) => {
  // 接收参数
  let { id } = req.query;
  // 定义sql 查询语句
  let sqlCommand = `select * from goodstype where id=${id}`;
  // 执行查询语句
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else{
      res.send(data);
    }
  })
})

// 接收 前端发来的 保存 修改后的商品分类的 post 请求
router.post('/typeEdit', (req, res) => {
  // res.send('0120210');
  // 接收前端发来的数据
  let { id, goodType, typeName, state } = req.body;
  // console.log(goodType, typeName, state);
  // 定义mysql 命令
  let sqlCommand = `update goodstype set goodType="${goodType}", typeName="${typeName}", state="${state}" where id=${id}`

  // 执行sql语句(插入数据-添加商品的分类)
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode': 1, 'msg':'修改成功!'});
      } else {
        res.send({'errcode': 0, 'msg':'修改失败!'});
      }
    }
  })
})

// 删除 商品分类  信息 *****
router.post('/typeDel', (req, res) => {
  // 接收参数
  let { id } = req.body;
  // 定义查询 商品信息
  let sqlCommand = `select * from goodstype where id=${id}`
  // 执行
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      console.log(data[0].typeName)
      let typeName = data[0].typeName;
      // 定义查询 商品信息
      let sqlCommand1 = `select * from goodslist where goodGenre='${typeName}'`
      connection.query(sqlCommand1, (err, data) => {
        if(err){
          throw err;
        } else {
          if(data.length > 0){
            // 有商品信息 则不能删除
            res.send({'errcode': 0, 'msg': '对不起! 无法删除,请先删除分类下的商品信息!'});
          } else {
            //没有则 删除
            let sqlCommand2 = `delete from goodstype where id=${id}`;
            connection.query(sqlCommand2, (err, data) => {
              if(err){
                throw err;
              } else {
                if(data.affectedRows > 0){
                  res.send({'errcode': 1, 'msg': '删除成功!'});
                } else {
                  res.send({'errcode': 0, 'msg': '删除失败!'});
                }
              }
            })
          }
        }
      })
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

// 接收前端的 获取 商品信息类表的 get 请求
router.get('/goodsList',(req, res) => {
  // res.send('100132165');
  // 获取参数
  let { pagesNum, pagesLists } = req.query;
  // 定义mysql 查询 命令 ( 全部 )
  let sqlCommand = `select * from goodslist`;
  // 执行 查询命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      let allListsNum = data.length; // 商品信息总条数
      //console.log(allListsNum);
      //res.send(data);
      // 定义 确定 页码和每页条数 的 sql 命令
      // 需要跳过的条数
      let nLists = (pagesNum - 1) * pagesLists;
      console.log(nLists, pagesLists);
      // 定义 确定 页码和每页条数 的 sql 命令
      // select * from goodslist order by ctime desc limit 0, 5;
      let sqlOnePages = `select * from goodslist order by ctime desc limit ${nLists}, ${pagesLists}`
      console.log(sqlOnePages);
      // 执行 命令
      connection.query(sqlOnePages, (err, data) => {
        if(err){
          throw err;
        } else {
          res.send({'allListsNum': allListsNum, 'pageData': data});
        }
      })
    }
  })
})

// 接受条件查询 商品信息 请求
router.post('/goodsQuery', (req, res) => {
  // ceshi
  // res.send('爱上了对方');
  // 接受参数
  let { goodTypeName, goodGenre, keyword, pagesNum, pagesLists } = req.body;
  console.log( goodTypeName, goodGenre, keyword, pagesNum, pagesLists );
  // 定义 sql 查询语句
  let sqlCommand = `select * from goodslist where 1=1`; // 查找全部
  // 判断是否有 分类查询
  if(goodTypeName != '' && goodTypeName != '全部' ){
    sqlCommand += ` and goodType = '${goodTypeName}'`;
  };
  if(goodGenre != '' && goodGenre != '全部'){
    sqlCommand += ` and goodGenre = '${goodGenre}'`;
  };
  if(keyword != ''){
    sqlCommand += ` and (barCode like '%${keyword}%' or goodsName like '%${keyword}%')`;
  };
  // 执行 查询命令
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      let allListsNum = data.length; // 商品信息总条数
      //console.log(allListsNum);
      //res.send(data);
      // 定义 确定 页码和每页条数 的 sql 命令
      // 需要跳过的条数
      let nLists = (pagesNum - 1) * pagesLists;
      console.log(nLists, pagesLists);
      // 定义 确定 页码和每页条数 的 sql 命令
      // select * from goodslist order by ctime desc limit 0, 5;
      sqlCommand += ` order by ctime desc limit ${nLists}, ${pagesLists}`;
      // 执行 命令
      connection.query(sqlCommand, (err, data) => {
        if(err){
          throw err;
        } else {
          res.send({'allListsNum': allListsNum, 'pageData': data});
        }
      })
    }
  })
})

// 接收 单条删除请求
router.post('/goodsDel', (req, res) => {
  // 测试
  // res.send('阿萨德了飞机案例是看得见')
  // 接收参数
  let { id } = req.body;
  // 定义 sql 条件删除数据 语句
  let sqlCommand = `delete from goodslist where id = '${id}'`
  // 执行 语句
  connection.query(sqlCommand, (err, data) => {
    if(err){
      throw err;
    } else {
      if(data.affectedRows > 0){
        res.send({'errcode': 1, 'msg': '成功删除一条产品信息!'})
      } else{
        res.send({'errcode': 0, 'msg': '删除失败!'})
      }
    }
  })
})

//
router.post('/batchDelGoods', (req, res) => {
  // 测试
  // res.send('阿萨德了飞机案例是看得见')
  // 接收参数
  // 接收得到的 前端发来的 需要删除的用户 ID 数组
  let idArr = req.body['idArr[]'];
  console.log(idArr)
  // 定义 数据库命令
  let sqlCommand = `delete from goodslist where id in (${idArr})`;
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
