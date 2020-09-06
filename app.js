//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// App Setup
const app = express();
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// DB Setup
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "No email specified."]
    },
    password: {
        type: String,
        required: [true, "No password specified."]
    }
});

userSchema.plugin(encrypt,{secret:process.env.SECRET_KEY, encryptedFields:['password']});

// User Model
const User = mongoose.model("User", userSchema);

// Home Route
app.get("/",function(req,res){
    res.render("home");
});

// Login Get Route
app.get("/login",function(req,res){
    res.render("login");
});

// Login Post Route
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(!foundUser){
                res.redirect("/login");
            }else{
                if(foundUser.password==password){
                    res.render("secrets");
                }else{
                    res.redirect("/login");
                }
            }
        }
    });
});

// Register Get Route
app.get("/register",function(req,res){
    res.render("register");
});

// Register Post Route
app.post("/register",function(req,res){
    const newUser = User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if (err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

// App Run
app.listen(3000,function (){
    console.log("Server started at port 3000.");
});