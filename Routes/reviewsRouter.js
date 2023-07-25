const express=require('express');
const reviewsController=require('./../Controllers/reviewsController')
const router=express.Router();

router.route('/:id'+'/updateReview'+"/:_id").patch(reviewsController.updateReview);
router.route('/reviews'+'/:id').get(reviewsController.getReviewsById);
router.route('/:id'+'/deleteReview'+"/:_id").put(reviewsController.deleteReview);

module.exports=router;