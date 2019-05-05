const express=require('express');
const app=express();
const mysql=require('mysql');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'douban'
});

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin','*');
    next();
})
//connection.connect();
app.get('/home',function (req,res) {
    //console.log(req.query);
    const sql='select * from users';
    connection.query(sql,function (error,results) {
        if(error) throw error;
        return res.send(results)
    })
})
app.post('/reg',function (req,res) {
    //console.log(req.query);
    const sql=`select name from users where name='${req.body.username}'`;
    connection.query(sql,function (error,results) {
        if(error) throw error;
        //console.log(results);
        if(!results.length){
            const sql=`insert into users (id,name,pass) values (0,'${req.body.username}','${req.body.password}')`;
            connection.query(sql,function (error,results) {
                if(error) throw error;
                //console.log(results);
                console.log(results);
            })
        }else{
            return res.send('用户名不能重复')
        };
    })
})



app.listen(1314)





