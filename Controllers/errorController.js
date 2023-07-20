const CustomError = require('./../utils/customError')
const customError=require('./../utils/customError')
const devErrors=(res,error)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message,
        stackTrace:error.stack,
        error:error
    })
}

const prodError=(res,error)=>{
   if(error.isOperational){
    //if required field is missing then this response
      res.status(error.statusCode).json({
         status:error.statusCode,
         message:error.message,
      })
   }else{
    //validation errors are coming from mongoose are non operational errors
      res.status(500).json({
         status:'error',
         message:'Something went wrong Please try again later...!'
      })
   }
}

const castErrorHandler=(err)=>{
   const msg=`Invalid value ${err.value} : ${err.path}`;
   return new customError(msg,400);
}

const duplicateKeyErrorHandler=(err)=>{
   const msg=`there is already a movie with name ${err.keyValue.name}.Please use another name`  
   return new CustomError(msg,400);
}

const ValidationErrorHandler=(err)=>{
   const errors=Object.values(err.errors).map(val=>val.message);
   const errorMessages=errors.join('. ');
   const msg=`Invlaid input data ${errorMessages}`
   return new CustomError(msg,400);
}

module.exports=(error,req,res,next)=>{
    error.statusCode=error.statusCode || 500;
    error.status=error.status || 'error';

    if(process.env.Node_ENV==='development'){
       devErrors(res,error)   
    }else if(process.env.Node_ENV==='production'){
      if(error.name==='CastError') error=castErrorHandler(error);
       if(error.code===11000) error = duplicateKeyErrorHandler(error);
       if(error.name='ValidationError') error=ValidationErrorHandler(error)

       prodError(res,error)
    }
}
//we want to make mongoose errors as operational errors so that we can send meaningful error message to the client