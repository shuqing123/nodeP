const express=require('express'),
    {user,task}=require('../model/sch'),
    crypto=require('crypto'),
    router=express.Router();
/*
0 成功
1 失败
2 服务器问题
3 .........
*/

router.get('/',(req,res)=>{
    res.render('index',{
        login:req.session.login,
        user:req.session.user,
        title:"首页"
    })
});

router.get('/reg',(req,res)=>{
    res.render('reg',{
        title:'注册'
    });
})
    .post('/reg',(req,res)=>{
    //console.log(req.body);
    user.findOne({username:req.body.username}).then((data)=>{
        if(data){
            return res.send({code:1,msg:'用户名已存在'})
        };
        //指定用什么方式加密
        const c=crypto.createHash('sha256');
        const password=c.update(req.body.password).digest('hex');
        user.create({
            username:req.body.username,
            password:password,
        }).then((data)=>{
            res.send({code:0,msg:'注册成功'});
        });
    });
});

router.get('/login',(req,res)=>{
    res.render('login',{
        login:req.session.login,
        title:'登录'
    });
})
    .post('/login',(req,res)=>{
    user.findOne({username:req.body.username},(err,data)=>{
      if(data){
          const c=crypto.createHash('sha256');
          const password=c.update(req.body.password).digest('hex');
          if(data.password===password){
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

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});
//详情页
router.get('/xq/:id',function (req,res) {
    task.findOne({_id:req.params.id}).populate('author receiver').exec(function (err,data) {
        //console.log(data);
        res.render('xq', {
            title: '详情页 - ' + data.title,
            user: req.session.user,
            login: req.session.login,
            data:data
        })
    })
})

module.exports=router;














