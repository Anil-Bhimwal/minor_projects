var express= require("express");
var router = express.Router({mergeParams: true});// new instance of the router and inside parameter will provide id's in this file
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
//Comment new
router.get("/new", isLoggedIn,function(req,res){
    //find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
   
});
// Comment Create
router.post("",isLoggedIn,function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else
        {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                       //connect new comment to campground
                    campground.comments.push(comment._id);
                    campground.save();
                     // redirect to campground show page
                     res.redirect("/campgrounds/" + campground._id);
                }
            });
         
           
        }
    });
   
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;
