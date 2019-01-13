var mongoose = require("mongoose");
var passportLocalMongoose  = require("passport-local-mongoose");

 var UserSchema= mongoose.Schema({
     username: String,
     password: String 
 });
 
 UserSchema.plugin(passportLocalMongoose); // to use passport inside the app.js
 module.exports= mongoose.model("user", UserSchema);