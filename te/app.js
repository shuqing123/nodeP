const mysql = require('mysql');
const express = require('express');
const app = express();
const session = require('express-session');
const crypto = require('crypto');
const MySQLStore = require('connect-mysql')(session);
const options = {
    config: {
        user: 'root',
        password: '123',
        database: 'test'
    }
};
let connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'test',
    multipleStatements: true
});

app.use(session({
    secret: 'lidj',
    rolling:true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*30,
    },
    store: new MySQLStore(options)
}))




//获取post参数
app.use(express.urlencoded({extended:false}));
//静态资源目录
app.use(express.static('./public'));



app.post('/login',(req,res)=>{
    console.log(req.body);

    const sql = `select username,password from user where username=?`
    connection.query(sql,req.body.username,function(err,data) {
        console.log(data);
        if(data){
           /* const c=crypto.createHash('sha256');
            const password=c.update(req.body.password).digest('hex');*/
            if(data.password===req.body.password){
                req.session.login=true;
                req.session.user=data;
                //console.log(data);
                return res.send({code:0,msg:'登录成功'});
            }
            return res.send({code:1,msg:'密码错误'});
        }
        return res.send({code:1,msg:'用户名不存在'});
    })
});





app.listen(3000)







