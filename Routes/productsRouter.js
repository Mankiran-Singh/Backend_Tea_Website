const express=require('express');
const productsController=require('./../Controllers/productsController')
const reviewsController=require('./../Controllers/reviewsController')
const authController=require('./../Controllers/authController')
const router=express.Router();


router.route('/').post(productsController.postProducts);
router.route('/').get(authController.protect,productsController.getProducts);
router.route('/:id').get(productsController.getProductById);

//router.route('/login').post(authController.login)
//router.route('/products').get(authController.protect)
module.exports=router;