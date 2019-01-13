var express= require("express");
var router = express.Router({mergeParams: true});// new instance of the router
var Campground = require("../models/campground");
// INDEX: show all campgrounds
router.get("/",function(req,res){
    //console.log(req.user);
    //Get all the campgrounds from Db
    Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       } 
       else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
       
});
//CREATE add new campground
router.post("/",function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var desc= req.body.description;
   var newCampground={name: name, image: image,description: desc};
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err); 
           
       }
       else{
        res.redirect("/"); 
       }
   });
//   campgrounds.push(newcampground);
// create a new campground and save to DB
 
   //get data from form and add it to campgrounds array
   //redirect back to campgrounds page
});
// to add new campground
//NEW show form to create new campground
router.get("/new",function(req,res){
   res.render("campgrounds/new"); 
});
//SHOW -shows more info about one campground 
router.get("/:id",function(req,res){
    //find the campground with provided id 
    Campground.findById(req.params.id) .populate("comments") .exec(function(err,foundCampground){
       if(err){
           console.log(err);
           
       } 
       else{
           console.log(foundCampground);
           res.render("campgrounds/show",{campground: foundCampground});
       }
    });
    
    // Render show template with that campground
   
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;
