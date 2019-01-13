var express= require("express");
var app=express();
var request = require("request");
app.set("view engine","ejs");
app.get("/",function(req,res){
    res.render("search");
});
app.get("/results", function(req,res){
    var query=req.query.search;
    var url="http://www.omdbapi.com/?i=" + query+"&apikey=thewdb"//http://www.omdbapi.com/?i=tt3896198&apikey=thewdb
   request(url,function(error,respose,body)
    {
       if(!error&& respose.statusCode==200)
       {
           var data=JSON.parse(body)//making an object for body
           res.render("results",{data:data});
       }
    });
});






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Movie app has started");
});