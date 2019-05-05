const express=require('express'),
    app=express(),
    session=require('express-session'),
    Mongosession=require('connect-mongo')(session),
    mongoose=require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost:27017/t',{useNewUrlParser: true});

//发送cookieid
app.use(session({
    secret:'slijeown',//密匙
    rolling:true,//每次操作，重新设定时间
    resave:false,//是否每次请求都重新保存
    saveUninitialized:false,//初始值
    cookie:{maxAge:1000*60*30},//保存时间
    store:new Mongosession({
        url:'mongodb://localhost:27017/t'
    })//保存到数据库
}))

//获取post参数
app.use(express.urlencoded({extended:false}));
//静态资源目录
app.use(express.static(__dirname+'/public'));
//模版引擎
app.set('view engine','ejs');
app.set('views',__dirname+'/view');

app.use('/',require('./router/index.js'));
app.use('/api', require('./router/api'));
app.use('/admin',require('./router/admin.js'));

app.listen(4545);
















