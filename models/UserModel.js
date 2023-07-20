const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
//firstName,lastName, email, password, confirm password
const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please enter name"]
  },
  isAdmin:{
     type:Boolean
  },
  email:{
     type:String,
     required:[true,"Please enter an email"],
     unique:true,
     lowerCase:true,
     validate:[validator.isEmail,"Please enter a valid email"]
  },
  password:{
    type:String,
    required:[true,"Please enter a password"],
    minLength:8,
    select:false //we don't want to return it in res while logging in 
  },
  confirmPassword:{
    type:String,
    required:[false,"Please confirm your password"],
    validate:{
        //this validator will only work for save and create
        validator:function(val){
           return val==this.password;
        },
        message:`Password & ConfirmPassword does'nt match!`
    }
  },
  photo:{
    type:String
  }
})

userSchema.pre('save',async function(next){
    //encryption is also called as hashing
   //before saving it in database we want to encrypt the password
   if(!this.isModified('password'))return next();

   this.password=await bcrypt.hash(this.password,12);
   this.confirmPassword=undefined; //first hash() will salt the password(add random string to it) and then hash it
   next();//cost=12=how cpu intensive this operation will be
})

userSchema.methods.comparePasswordInDB=async function(password,passwordDB){
   return await bcrypt.compare(password,passwordDB)
}
const User=mongoose.model('User',userSchema)
module.exports=User;