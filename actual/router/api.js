const express=require('express'),
    router=express.Router(),
    path=require('path'),
    {user,task}=require('../model/sch'),
    multer=require('multer');

const storage=multer.diskStorage({//diskStorage
    //1.__dirname 当前文件所在的目录
    //2.process.cwd()
    destination:path.join(process.cwd(),"public/upload"),
    filename:function (req,file,callback) {
        const h = file.originalname.split('.');
        //console.log(h);
        const filename = `${Date.now()}.${h[h.length - 1]}`;
        callback(null, filename);
    }
});

const fileFilter = function (req,file,cb) {
    if(file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' ){
        req.goudan===123;
        cb(null,true)
    }
}

const upload=multer({
    storage,
    fileFilter
});

router.post('/upload',(req,res)=>{
    //
    upload.single("file")(req,res,function (err) {
        /*console.log(req.file);
        console.log(req.file.filename);
        console.log(req.file.destination);*/
        if (err) {
            return res.send({code: 1})
        }
        res.send({code: 0, data: {
                src: `/upload/${req.file.filename}`
            }})
    })
})
//全部任务
router.post('/task/all',function (req,res) {
    Promise.all([
        task.find().populate('author').sort({_id: -1}).skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        task.countDocuments()
    ]).then(function (data) {
        //console.log(data);
        res.send({code: 0, data: data[0], count: data[1]});
    });
})
//可接取的任务
router.post('/task/can',function (req,res) {
    Promise.all([
        task.find({can:false}).populate('author').sort({_id: -1}).skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        task.countDocuments({can:false})
    ]).then(function (data) {
        res.send({code:0,data:data[0],count:data[1]})
    })
})

router.post('/task/notcan',function (req,res) {
    Promise.all([
        task.find({can:true}).populate('author').sort({_id: -1}).skip((req.body.page - 1) * req.body.limit).limit(Number(req.body.limit)),
        task.countDocuments({can:true})
    ]).then(function (data) {
        res.send({code:0,data:data[0],count:data[1]})
    })
})

router.post('/task/my',function (req,res) {
    user.findOne({_id:req.session.user._id})
        .populate({
            path:'task.publish',
            options:{
                sort:{_id:-1},
                skip:(req.body.page-1) * req.body.limit,
                limit:Number(req.body.limit)
            }
        }).then(function (data) {
        res.send({code: 0,data:data.task.publish, count:data.task.publish.length})
    })
});
router.post('/task/ing', function (req, res) {
    user.findOne({_id: req.session.user._id})
        .populate({
            path: 'task.receive',
            options: {
                sort: {_id: -1},
                skip: (req.body.page - 1) * req.body.limit,
                limit: Number(req.body.limit)
            }
        }).then(function (data) {
        res.send({code: 0, data: data.task.receive, count: data.task.receive.length})
    })
});
router.post('/task/fin', function (req, res) {
    user.findOne({_id: req.session.user._id})
        .populate({
            path: 'task.accomplish',
            options: {
                sort: {_id: -1},
                skip: (req.body.page - 1) * req.body.limit,
                limit: Number(req.body.limit)
            }
        }).then(function (data) {
        res.send({code: 0, data: data.task.accomplish, count: data.task.accomplish.length})
    })
});


module.exports=router;













