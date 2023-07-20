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


// productsSchema.post('save',async function(next){
//     //first hash() will salt the password(add random string to it) and then hash it
//     sum=0;
//     for(let i in this.reviews){
//         if(this.reviews[i].isApproved){
//            sum+=this.reviews[i].isApproved
//         }
//     }
//     this.isApproved=sum;
//     next();//cost=12=how cpu intensive this operation will be
// })

const products=mongoose.model('products',productsSchema)
module.exports=products;