const express=require('express');
const authController=require('./../Controllers/authController')
const router=express.Router();

router.route('/signUp').post(authController.signup);
router.route('/login').post(authController.login)

//router.route('/products').get(authController.protect)
module.exports=router;