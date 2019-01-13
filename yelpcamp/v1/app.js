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



// requiring routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");
mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

//seedDB();//seed the database
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

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);//inside campground(CREATE) routes starts with /caampgrounds so we can remove this duplicacy using first parameter 
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp Server Has Started");
});  