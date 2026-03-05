const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("../models/listing.js");
const router=express.Router();
const {isLoggedIn}=require("../middleware.js");
const { findById } = require("../models/review.js");
const {validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js")
const listingControllers=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage});


router.route("/")
.get(validateListing,wrapAsync(listingControllers.index))
.post(isLoggedIn, validateListing,upload.single("image"),wrapAsync(listingControllers.createListing));

//new route
router.get("/new",isLoggedIn,listingControllers.renderNewform)


router.route("/:id")
.get(validateListing,wrapAsync(listingControllers.showListings))
.put(isLoggedIn,isOwner,upload.single("image"), wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editListing))

module.exports=router;