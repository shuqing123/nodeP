const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser: true});



const userSchema=new mongoose.Schema({
    username:{type:String,required:true,default:'aaaaa'},
    password:{type:String,required:true}
});

const user=mongoose.model('user',userSchema);

user.create({
    username:'nimen',
    password:'789456'
});
user.find((err,data)=>{
    console.log(data);
});













