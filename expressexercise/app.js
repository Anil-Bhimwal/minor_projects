var express= require("express");
var app=express();
app.get("/",function(req,res){
    res.render("home.ejs");
    
});
app.get("/speak/pig",function(req , res){
    res.send("the pig says,'oink'");
});
app.get("/speak/dog",function(req , res){
    res.send("the dog says,'wouf wouf'");
});
app.get("/speak/cow",function(req , res){
    res.send("the cow says,'moo'");
});
app.get("/repeat/:string/:no_of_times",function(req,res){
    var string = req.params.string;
    var number= req.params.no_of_times;
    var result="";
    for(var i=0;i<number;i++)
    {
          result+= string;
    }
  res.send(result);
});

app.get("/:thing",function(req,res)
{
    var thing=req.params.thing;
    res.render("love.ejs",{thingsvar: thing});
});

app.get("/new/post",function(req,res){
    var posts=[
        { title:"post",author:"sushy"},
        {title: "my adorable pet bunny",author:"charlie"},
        {title:"can you believe this?",author:"anil"}
        ];
        res.render("post.ejs",{posts:posts});
});
app.get("*",function(req,res){
    res.send("arbitrary string");
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});