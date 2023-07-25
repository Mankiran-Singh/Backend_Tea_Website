const Products=require('../models/productsModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');
const ApiFeatures=require('./../utils/ApiFeatures')

//Post Products api controller
exports.postProducts=asyncErrorHandler(async (req,res,next)=>{
    const product=await Products.create(req.body);  
    res.status(201).json({
       status:'success',
       data:{
         product
       }
    });
 })

 exports.getProducts=asyncErrorHandler(async(req,res,next)=>{
    let page = req.query.page*1 || 1;
    let limit = req.query.limit*1 || 2;
    let skip = (page -1) * limit;

    let product=await Products.aggregate([
        {$unwind:"$reviews"},
        {$group:{
           _id:"$_id",
           price:{"$first":"$price"},
           name: { "$first": "$name" },
           brand:{"$first":"$brand"},
           description:{"$first":"$description"},
           detail:{"$first":"$detail"},
           isApproved:{
            '$sum':{ "$cond": [
                { "$and": [ 
                    { "$eq": [ "$reviews.isApproved", true ] },
                    { "$gt": [ "$reviews.rating", 0 ] }
                ]},    
                1, 
                0
            ]}
           },
           totalRating:{ 
            '$sum': {
                '$cond': [
                    { '$eq': ['$reviews.isApproved', true]},'$reviews.rating',0
                ]
            },
        }, 
         reviews:{"$push":{
            name:"$reviews.name",
            heading:"$reviews.heading",
            description:"$reviews.description",
            rating:"$reviews.rating",
            isApproved:"$reviews.isApproved",
            _id:"$reviews._id"
         }}
        }
    },
      {
         $project: {name: 1,price:1,description:1,totalRating:1,isApproved:1,brand:1,detail:1,reviews:1,
         averageRating:   { $cond: [ { $eq: [ "$isApproved", 0 ] }, 0,  {
            $divide: [
              "$totalRating",
              "$isApproved"
            ]
          }]}}
      },
      {$sort:{averageRating:-1}},
      {$skip:skip},
      {$limit:limit}
    ]);

   res.status(200).json({
       status:'success',
       count:product.length,
       data:{
           product
       }
   })
 })


exports.getProductById=asyncErrorHandler(async(req,res,next)=>{
    const product=await Products.findById(req.params.id);
    if(!product){
        const err=new CustomError("Product with the error not found",404)
        return next(err);
      }

    res.status(200).json({
        status:'success',
        data:{
            product
        }
    })
})
