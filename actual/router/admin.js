const express=require('express'),
    {user,task}=require('../model/sch'),
    crypto=require('crypto'),
    router=express.Router();


router.use((req,res,next)=>{
    if(req.session.login){
        if(req.session.user.level>=10){
            return next();
        }
        return res.send('没有权限');
    }
    res.send('登录成功');
})

router.get('/user',(req,res)=>{
    //console.log(req.session.user),
    res.render('admin/user',{
        user:req.session.user,
        title:'用户管理'
    });
})
    .post('/user',(req,res)=>{
    //从第几个开始查找，查找多少个
    Promise.all([
        user.find().skip((req.body.page-1)*req.body.limit).limit(Number(req.body.limit)),
        user.countDocuments()//总共有多少条数据
    ]).then((data)=>{
        //code 成功否 data 数据 count 总页数
        res.send({code:0,data:data[0],count:data[1]});
    })
})
//帐号是否可用
router.post('/user/reuserlevel',(req,res)=>{
    //console.log(typeof req.body.used);
    user.findOne({_id:req.body.user_id},function (err,data) {
        //console.log(data.level);
        if(req.session.user.level<data.level){
            return res.send({code:1,data:'权限不足'})
        }
        user.updateOne({_id:req.body.user_id},{$set:{used:req.body.used}}, (err,data)=> {
            if(err){
                return res.send('数据库错误')
            }
            res.send({code:0,data:'修改成功'});
        });
    });

})
//修改账户级别
router.post('/user/relevel',(req,res)=>{
    user.findOne({_id:req.body._id},function (err,data) {
        //console.log(data.level);
        if(req.session.user.level<=data.level){
            return res.send({code:1,data:'权限不足'})
        }
        user.updateOne({_id:req.body._id},{$set:{level:req.body.level}}, (err,data)=> {
            if(err){
                return res.send('数据库错误')
            }
            res.send({code:0,data:'修改成功'});
        });
    });

})
//删除用户
router.post('/user/del',(req,res)=>{
    user.findOne({_id:req.body._id},function (err,data) {
        if(data.level>=999){
            return res.send({code:1,data:'不能删除超级管理员'})
        }
        if(data.level>req.session.user.level){
            return res.send({code:1,data:'不能删除高级别的管理员'})
        }
        if(data.level===req.session.user.level){
            return res.send({code:1,data:'不能删除同级别管理员'})
        }
        // TODO:// 关联的文章/任务 删除
        Promise.all([
            user.deleteOne({_id:req.body._id}),//删除用户
            task.deleteMany({author:req.body._id}),//删除关联的文章
            task.updateMany({receiver: req.body._id}, {$pull: {receiver: req.body._id}})//删除接取的任务，评论
        ]).then((data)=>{
            res.send({code:0})
        });
    })

});
//发布文章
router.get('/task/add',(req,res)=>{
    res.render('admin/addtask',{
        user:req.session.user,
        title:'发布'
    })
})
    .post('/task/add',function (req,res) {
    const data=req.body;
    data.author=req.session.user._id;
    console.log(data);
    task.create(data,function (err,data) {
        if(err){
            return res.send({code:1,data:'数据库错我'});
        }
        user.updateOne({_id: req.session.user._id}, {$push: {'task.publish': data._id}}, function () {
            res.send({code: 0, data: '保存成功'})
        });
    })
})
//任务管理
router.get('/task/all',function (req,res) {
    res.render('admin/deletetask',{
        user:req.session.user,
        title:'任务管理'
    })
})
    .post('/task/all',function (req,res) {
    Promise.all([
        task.find().populate('author').skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        task.countDocuments()
    ]).then(function (data) {
        //console.log(data);
        res.send({code: 0, data: data[0], count: data[1]});
    });
})
//文章删除
router.post('/task/del',function (req,res) {
    Promise.all([
        task.deleteOne({_id:req.body._id}),
        user.updateMany(
            {$or: [{'task.publish': req.body._id}, {'task.receive': req.body._id}, {'task.accomplish': req.body._id}]},
            {$pull: {'task.publish': req.body._id, 'task.receive': req.body._id, 'task.accomplish': req.body._id}}
        )
    ]).then();

})

module.exports=router;










