//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// App Setup
const app = express();
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Home Route
app.get("/",function(req,res){
    res.render("home");
});

// Login Route
app.get("/login",function(req,res){
    res.render("login");
});

// Register Route
app.get("/register",function(req,res){
    res.render("register");
});

// App Run
app.listen(3000,function (){
    console.log("Server started at port 3000.");
});