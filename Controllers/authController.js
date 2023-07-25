const User=require('./../models/UserModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');
const sendEmail=require('./../utils/email');
const crypto=require('crypto');
const util=require('./../utils/customError')
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

exports.forgotPassword=asyncErrorHandler(async(req,res,next)=>{
   //1. GET USER BASED ON POSTED EMAIL
   const user=User.findOne({email:req.body.email});
   if(!user){
      const error=new CustomError("We can't find user with given email",404)
      next(error);
   }
   
   //2. GENERATE RANDOM ACCESS TOKEN
   const resetToken=user.createResetPasswordToken();
   await user.save({validateBeforeSave:false});
   
   //3. SEND THE TOKEN BACK TO USER EMAIL
   const resetUrl=`${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`
   const message=`We have received password reset request. Please click on the below link to reset your password\n\n${resetUrl}\n\n This reset password link will be available for 10 minutes`;
   try{
      await sendEmail({
         email:user.email,
         subject:'Password change request received',
         message:message
     });  
     res.status(200).json({
       status:'success',
       message:'password reset email link sent to your email'
     })
   }catch(err){
      user.passwordResetToken=undefined,
      user.passwordResetTokenExpires=undefined,
      user.save({validateBeforeSave:false})
      return next(new CustomError('There was an error sending password reset email. Please try again later',500))
   }
})

exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{
   const token=crypto.createHash('sha256').update(req.params.token).digest('hex')
   const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}})
    if(!user){
      const error=new CustomError("Token is invalid or has expired",404)
      next(error);
    }
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    //user.passwordChangedAt=Date.now();

    user.save();
    //Login the user once his password has changed
    const loginToken=signToken(user._id);
    res.status(200).json({
       status:'success',
       data:{
          loginToken,
          name:user.name,
          isAdmin:user.isAdmin,
          photo:user.photo
       }
    })
})

exports.protect=asyncErrorHandler(async(req,res,next)=>{
   //1. Read the token and check if exists
      const testToken=req.header.authorization
      let token; 
      if(testToken && testToken.startsWith('bearer')){
         token=testToken.split(' ')[1];          
      }
      if(!token){
         next(new CustomError('You are logged in',401));
      }
      console.log(token);
      //2. Validate the token
      const decodedToken=await util.promisify(jwt.verify)(token,process.env.SECRET_STR);
      console.log(decodedToken);

   //3. If the user exists   
      const user=await User.findById(decodedToken.id);
      if(!user){
         const error=new CustomError('The user with the given token does not exist',401);
         next(error);
      }
   //4. If the user changed password after the token was issued
    const isPasswordChanged=await user.isPasswordChanged(decodedToken.jwt);  
   if(isPasswordChanged){
        const error=new CustomError('The password has been recently changed.Please login again',401);
        return next();
     }
   //5. Allow the user to access route
   req.user=user;
   
   next();
})