var express=require("express");
var app= express();
app.get("/",function(req,res){
    res.send("HI THERE!!");
});
app.get("/bye",function(req,res){
    res.send("GOODBYE BABY");
});

app.get("/r/:subredditname",function(req,res){
    console.log(res);
    res.send("WELCOME TO SUBREDDIT!");
});
app.get("*",function(req,res){
    res.send("You are a star!!");
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started!");
});
