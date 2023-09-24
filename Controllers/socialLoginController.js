const User=require('./../models/UserModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');
const {OAuth2Client}=require('google-auth-library');

const signToken=id=>{
    return jwt.sign({id},process.env.SECRET_STR,{
       expiresIn:process.env.LOGIN_EXPIRES
   })
 }

const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin=asyncErrorHandler(async(req,res,next)=>{
    const {idToken}=req.body;
    client.verifyIdToken({idToken,audience:process.env.GOOGLE_CLIENT_ID}).then(async (response)=>{
      console.log(response.getPayload());
        const {email_verified,picture}=response.getPayload();
        if(email_verified){
            const existingUser=await User.findOne({email:response.getPayload().email});
            if(!existingUser){
                      let password=response.getPayload().email+process.env.SECRET_STR
                      const newUser=await User.create({name:response.getPayload().name,email:response.getPayload().email,password,photo:picture})
                      const token=signToken(newUser._id);
                      const {_id, name, email}=newUser;
                      res.status(200).json({
                       status:'success',
                       data:{
                         token,
                         firstName:newUser.name,
                         user:{_id, name, email},
                        //  isAdmin:false
                       }
                    })
            }else{
                const token=signToken(existingUser._id);
                res.status(200).json({
                status:'success',
                 data:{
                   token,
                   name:existingUser.name,
                  //  isAdmin:existingUser.isAdmin,
                   photo:existingUser.photo
                 }
           })
        }
      }
    });   
})

// exports.logOut=asyncErrorHandler(async(req,res,next)=>{
//     const auth=OAuth2Client.getAuthInstance();
//     auth.signOut()
// })