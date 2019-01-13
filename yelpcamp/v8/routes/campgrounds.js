var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){

     Campground.findById(req.params.id, function(err, foundCampground){
                 res.render("campgrounds/edit",{campground: foundCampground});
     });
 
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id",checkCampgroundOwnership,function(req,res){
    //FIND AND UPDATE THE CORRECT CAMPGROUND
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //REDIRECT SOMEWHERE(SHOW PAGE)
});
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

//middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
    // if user logged in
        if(req.isAuthenticated()){
             Campground.findById(req.params.id, function(err, foundCampground){
        
                if(err){
                    res.redirect("back");
                } else{
                    //does user own the campground?
                    //we can't do, if(campground.author.id===req.user._id) because first one is an object and second one is a string, still they looks same if we console.log them
                    if(foundCampground.author.id.equals(req.user._id)){
                         next()
                    } else{ // otherwise, redirect
                         res.redirect("back");
                    }
                   
                }
         });
        } else{ // if not, redirect
            res.redirect("back");
        }
    
}
module.exports = router;

