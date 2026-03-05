const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("../models/listing.js");
const Review=require("../models/review.js");
const router=express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");

//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))


//delte post route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destroyReview))
module.exports=router;