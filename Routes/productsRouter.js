const express=require('express');
const productsController=require('./../Controllers/productsController')
const authController=require('./../Controllers/authController')
const router=express.Router();

router.route('/').post(productsController.postProducts);
router.route('/').get(authController.protect,productsController.getProducts);
router.route('/:id').get(productsController.getProductById);
router.route('deleteProduct/:id').delete(authController.protect,authController.restrict('admin'),productsController.deleteProduct);
module.exports=router;