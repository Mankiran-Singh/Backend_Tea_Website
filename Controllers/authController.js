const User=require('./../models/UserModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');

const signToken=id=>{
   return jwt.sign({id},process.env.SECRET_STR,{
      expiresIn:process.env.LOGIN_EXPIRES
  })
}
//Sign Up
exports.signup=asyncErrorHandler(async (req,res,next)=>{
   const newUser=await User.create(req.body);
   const token=signToken(newUser._id)
   //token
   res.status(201).json({
      status:'success',
      data:{
        token,
        user:newUser
      }
   });
})

exports.login=asyncErrorHandler(async(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    //const {email,password}=req.body object destructuring syntax
    //Check if email and password is present in request body
    if(!email || !password){
       const error=new CustomError("Please provide email and password for logging in",400);
       return next(error);
    }
    //Check if user exists in the database or not
    const user=await User.findOne({ email }).select('+password');

    //const isMatch=await user.comparePasswordInDB(password,user.password)
    
    //Check if user exists & password matches
    if(!user || !(await user.comparePasswordInDB(password,user.password))){
       const error=new CustomError("Correct email or password",404)
       return  next(error);
    }
    
    const token=signToken(user._id);
    res.status(200).json({
       status:'success',
       data:{
          token,
          name:user.name,
          isAdmin:user.isAdmin,
          photo:user.photo
       }
    })
})

// exports.protect=asyncErrorHandler(async(req,res,next)=>{
//    //1. Read the token & check if it exists
//    //2. Validate the token
//    //3. if the user exists
//    //4. if the user changed the password after the token was issued
//    //5. Allow user to access route
//    next();
// })
