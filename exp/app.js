const express=require('express');
const app=express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));





app.set('view engine','ejs');
app.set('views',__dirname+'/view');
app.post('/login',(req,res)=>{
    res.render("test",{
        name:req.body,
    });
});
app.listen(8888);












