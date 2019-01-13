// ALL THE MIDDLEWARE GOES HERE
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    // if user logged in
        if(req.isAuthenticated()){
             Campground.findById(req.params.id, function(err, foundCampground){
        
                if(err){
                    res.redirect("back");
                } else{
                    //does user own the campground?
                    //we can't do, if(campground.author.id===req.user._id) because first one is an object and second one is a string, still they looks same if we console.log them
                    if(foundCampground.author.id.equals(req.user._id)){
                         next();
                    } else{ // otherwise, redirect
                         res.redirect("back");
                    }
                   
                }
         });
        } else{ // if not, redirect
            res.redirect("back");
        }
    
};


middlewareObj.checkCommentOwnership= function(req,res,next){
    // if user logged in
    if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
    
            if(err){
                res.redirect("back");
            } else{
                //does user own the comment?
                //we can't do, if(comment.author.id===req.user._id) because first one is an object and second one is a string, still they looks same if we console.log them
                if(foundComment.author.id.equals(req.user._id)){
                     next();
                } else{ // otherwise, redirect
                     res.redirect("back");
                }
               
            }
     });
    } else{ // if not, redirect
        res.redirect("back");
    }
    
};

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};



module.exports=middlewareObj;