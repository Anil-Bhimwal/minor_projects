var express    =require("express");
var app        =express();
var bodyparser =require("body-parser");
var mongoose   =require("mongoose");//lecture 290 yelpcamp add mongoose
var Campground = require("./models/campground");
var seedDB     = require("./seeds");
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
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
    //Get all the campgrounds from Db
    Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       } 
       else{
            res.render("index",{campgrounds:allCampgrounds});
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
   res.render("new.ejs"); 
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
           res.render("show",{campground: foundCampground});
       }
    });
    
    // Render show template with that campground
   
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp Server Has Started");
});  