var  express    =require("express"),
     app        =express(),
     bodyparser =require("body-parser"),
     mongoose   =require("mongoose"),//lecture 290 yelpcamp add mongoose
     Campground = require("./models/campground"),
     seedDB     = require("./seeds"),
     Comment    = require("./models/comment"),
     passport  = require("passport"),
     User                  = require("./models/user"),
     localStrategy         = require("passport-local"),
     passportLocakMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Anything came here",
    resave:  false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){// middleware to pass currentuser on every ejs file
    res.locals.currentUser=req.user;
    next();
});

//console.log(__dirname);
//SCHEMA  

//creating a model that we can use, we can use it with different methods here we will use find method
// Campground.create(
//     {
//         name :"Granite Hill",
//         image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
//         description:" This is a huge granite hill,No water , No food, only Beautiful Granite"
//     }, function(err,campground){
//         if(err){
//             console.log(" SOMETHING WEN WRONG");
//         }
//         else{
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     });



app.get("/",function(req,res){
    res.render("landing");
});
// we will use database later for now we are using an array.
//INDEX Show all Campgrounds
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var desc= req.body.description;
   var newCampground={name: name, image: image,description: desc};
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err); 
           
       }
       else{
        res.redirect("/campgrounds"); 
       }
   });
//   campgrounds.push(newcampground);
// create a new campground and save to DB
 
   //get data from form and add it to campgrounds array
   //redirect back to campgrounds page
});
// to add new campground
//NEW show form to create new campground
app.get("/campgrounds/new",function(req,res){
   res.render("campgrounds/new"); 
});
//SHOW -shows more info about one campground 
app.get("/campgrounds/:id",function(req,res){
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
//===========================================================
//COMMENT ROUTES
//===========================================================

app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
   
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

//============
// AUTH ROUTES
//============
app.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up

app.post("/register",function(req,res){
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

app.get("/login",function(req,res){
    res.render("login");
});

// HANDLING LOGIN LOGIC
app.post("/login" ,passport.authenticate("local" ,{//Middleware=code that runs before our route callback 
    successRedirect:"/campgrounds" ,
    failureRedirect:"/login"
}),function(req,res){
    
    
});

//logout logic route
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp Server Has Started");
});  