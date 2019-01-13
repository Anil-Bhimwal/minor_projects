var express= require("express");
var router = express.Router({mergeParams: true});// new instance of the router
var passport = require("passport");
var User  = require("../models/user");

//root route
router.get("/",function(req,res){
    res.render("landing");
});

// show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up

router.post("/register",function(req,res){
   var newUser = new User({username: req.body.username});
    User.register( newUser  ,req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       } else{
           passport.authenticate("local")(req,res,function(){
              res.redirect("/campgrounds"); 
           });
       }
    });
});

//LOGIN ROUTE

router.get("/login",function(req,res){
    res.render("login");
});

// HANDLING LOGIN LOGIC
router.post("/login" ,passport.authenticate("local" ,{//Middleware=code that runs before our route callback 
    successRedirect:"/campgrounds" ,
    failureRedirect:"/login"
}),function(req,res){
    
    
});

//logout logic route
router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;