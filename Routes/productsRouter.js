const express=require('express');
const productsController=require('./../Controllers/productsController')
const reviewsController=require('./../Controllers/reviewsController')
const router=express.Router();

router.route('/').post(productsController.postProducts);
router.route('/').get(productsController.getProducts);

router.route('/:id'+'/updateReview'+"/:_id").patch(reviewsController.updateReview);
router.route('/:id').get(productsController.getProductById);
router.route('/reviews'+'/:id').get(reviewsController.getReviewsById);

router.route('/:id'+'/deleteReview'+"/:_id").put(reviewsController.deleteReview)
//router.route('/login').post(authController.login)
//router.route('/products').get(authController.protect)
module.exports=router;