const mongoose=require('mongoose');
const validator=require('validator');

const productsSchema=new mongoose.Schema({
      price:{
        type:Number,
        required:[true,"Please enter Price of product"]
      },
      description:{
        type:String,
        required:[true,"Please enter description of product"]
      },
      brand:{
         type:String,
         required:[true,"Enter brand of product"]
      },
      name:{
         type:String,
         required:[true,"Please enter name"],
      },
      image:{
        type:String,
        required:[true,"Please upload image"]
      },
      detail:{
         type:String,
         required:[true,"Enter product detail"]
      },
      approvedReviews:{
         type:Number
      },
      averageRating:{
        type:Number
      },
      reviews:[
        {
            name:{type:String,required:[true,"Please enter your name"]},
            heading:{type:String,required:[true,"Please enter heading"]},
            description:{type:String,required:[true,'Please describe it']},
            rating:{type:Number,required:[true,'Please rate the product']},
            isApproved:{type:Boolean,default:false}
        }
      ]
})

const products=mongoose.model('products',productsSchema)
module.exports=products;