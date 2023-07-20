const Products=require('../models/productsModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const CustomError = require('./../utils/customError');

exports.updateReview=asyncErrorHandler(async (req,res,next)=>{
    const productUpdated=await Products.updateOne
        ({
            _id: req.params.id
           },
           {
            $set: {
                     "reviews.$[x]":req.body
              }
            },
           {
            arrayFilters: [
             {
                'x._id':req.params._id
             }
            ]
           })
    res.status(200).json({
        status:'success',
        data:{
            product:productUpdated
        }
    })
})

exports.getReviewsById=asyncErrorHandler(async(req,res,next)=>{
   const product=await Products.findById(req.params.id)
   
   if(!product.reviews){
     const err=new CustomError("Product with the error not found",404)
     return next(err);
   }
   res.status(200).json({
    status:'success',
    data:{
        reviews:product.reviews
    }
})
})

exports.deleteReview=asyncErrorHandler(async (req,res,next)=>{
    const productDeleted=await Products.updateOne(
        { _id:  req.params.id}, 
        { $pull: { reviews: { _id: req.params._id } } },// Upsert
        {multi:true} // Multi
    );
    res.status(200).json({
        status:'success',
        data:{
            product:productDeleted
        }
    })
})