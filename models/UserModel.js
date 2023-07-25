const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
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
  },
  passwordChangedAt:Date,
  passwordResetToken:String,
  passwordResetTokenExpires:Date
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

userSchema.methods.passwordChanged=(JWTTimestamp)=>{
   if(this.passwordChangedAt){
       const passwordChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000);
       console.log(this.passwordChangedAt,JWTTimestamp)
      return JWTTimestamp<passwordChangedTimestamp
    }
   return false;
}

userSchema.methods.createResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires=Date.now()+10*60*1000;
    return resetToken; 
}
const User=mongoose.model('User',userSchema)
module.exports=User;