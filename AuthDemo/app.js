var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    localStrategy         = require("passport-local"),
    passportLocakMongoose = require("passport-local-mongoose");
   
mongoose.connect("mongodb://localhost:27017/auth_demo_app");
var app  = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Baba ji ka thullu",
    resave:  false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============================
//ROUTES
//===============================

app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});

//Auth Route
app.get("/register",function(req,res){
    res.render("register");
});
//handling user sign up

app.post("/register",function(req,res){
   
    User.register(new User({username: req.body.username}),req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       } else{
           passport.authenticate("local")(req,res,function(){
              res.redirect("/secret"); 
           });
       }
    });
});

//LOGIN ROUTE

app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login" ,passport.authenticate("local" ,{//Middleware=code that runs before our route callback 
    successRedirect:"/secret" ,
    failureRedirect:"/login"
}),function(req,res){
    
    
});
app.get("/logout",function(req,res){
   req.logout();res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("AuthDemo Server Has Started");
});