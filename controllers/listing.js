const listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index=async (req,res)=>{
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listings){
      req.flash("error","Listing you requested for doesn't exist");  
      return res.redirect("/listings");
    }
    console.log(listings);
    res.render("listings/show.ejs",{listings});
}


module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 2
})
  .send()
    let url=req.file.path;
    let filename=req.file.filename;
        const newListing=new listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;
    let saved=await newListing.save();
    console.log(saved);
    req.flash("success","New listing created");
    res.redirect("/listings");
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    console.log(listings.image);
    if(!listings){
      req.flash("error","Listing you requested for doesn't exist");  
      return res.redirect("/listings");
    }
    let originalImageUrl=listings.image.url;
    originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listings,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let { id } = req.params;
        let Listing=await listing.findById(id);
        if(!Listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","you don't have the permission to edit");
            return res.redirect(`/listings/${id}`);
        }
    let listings=await listing.findByIdAndUpdate(id,{ ...req.body.listing });
    if(typeof req.file!== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listings.image={url,filename};
    await listings.save();}
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
}
module.exports.showFilteredListings = async (req, res) => {
  let { category } = req.query;
  console.log("Category:", category);
  let allListings;
  if (category) {
    allListings = await listing.find({
      category: { $regex: new RegExp("^" + category + "$", "i") }
    });
  } else {
    allListings = await listing.find({});
  }
  res.render("listings/index.ejs", { allListings });
};