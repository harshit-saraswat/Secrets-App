//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// App Setup
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Session Setup
app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


// DB Setup
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex",true);

// User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// User Model
const User = mongoose.model("User", userSchema);

// Passport Setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// OAUTH Setup
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Home Route
app.get("/", function (req, res) {
    res.render("home");
});

// Google Oauth Route
app.get("/auth/google",
    passport.authenticate("google",{scope:['profile']})
);

// Secrets Get Route
app.get("/secrets", function (req, res) {
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

// Login Get Route
app.get("/login", function (req, res) {
    res.render("login");
});

// Login Post Route
app.post("/login", function (req, res) {
    const newUser = new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(newUser,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            }); 
        }
    })
});

// Register Get Route
app.get("/register", function (req, res) {
    res.render("register");
});

// Register Post Route
app.post("/register", function (req, res) {
    User.register({username:req.body.username},req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            }); 
        }
    });
});

// Logout Route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/")
});

// App Run
app.listen(3000, function () {
    console.log("Server started at port 3000.");
});