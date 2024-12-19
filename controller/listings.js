const Listing = require("../models/listing.js");

//index route
module.exports.index = async (req,res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
};

//create route
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
  };

//post create route
module.exports.newlisting = async(req,res,next)=>{   
    let url = req.file.path; 
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
};

//show route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","This listing does not exist anymore :(");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};
//update route
module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","This listing does not exist anymore :(");
      res.redirect("/listings");
    }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("./listings/edit.ejs",{listing, originalImageUrl});
  };

//post update route
module.exports.updatedListing = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path; 
  let filename = req.file.filename; 
  listing.image = {url, filename};
  await listing.save();
  }
  req.flash("success","Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

//delete route
module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
  };