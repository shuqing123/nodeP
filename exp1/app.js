const express=require('express');
const app=express();
const mysql=require('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'douban'
})


app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

app.post('/get',(req,res)=>{
    connection.connect();
    const sql='select * from users';
    connection.query(sql,function (error,results,fields) {
        if(error) throw error;
        let r=JSON.stringify(results)
        res.send(r)
    })
    connection.end();
})



app.listen(5555);
















