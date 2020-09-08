//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

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
    email: {
        type: String,
        required: [true, "No email specified."]
    },
    password: {
        type: String,
        required: [true, "No password specified."]
    }
});

userSchema.plugin(passportLocalMongoose);

// User Model
const User = mongoose.model("User", userSchema);

// Passport Setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home Route
app.get("/", function (req, res) {
    res.render("home");
});

// Login Get Route
app.get("/login", function (req, res) {
    res.render("login");
});

// Login Post Route
app.post("/login", function (req, res) {
    // const username = req.body.username;
    // const password = md5(req.body.password);

    // User.findOne({ email: username }, function (err, foundUser) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (!foundUser) {
    //             res.redirect("/login");
    //         } else {
    //             bcrypt.compare(password, foundUser.password, function (err, result) {
    //                 if (result == true) {
    //                     res.render("secrets");
    //                 } else {
    //                     res.redirect("/login");
    //                 }
    //             });
    //         }
    //     }
    // });
});

// Register Get Route
app.get("/register", function (req, res) {
    res.render("register");
});

// Register Post Route
app.post("/register", function (req, res) {

    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //     const newUser = User({
    //         email: req.body.username,
    //         password: hash
    //     });

    //     newUser.save(function (err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.render("secrets");
    //         }
    //     });
    // });

    
});

// App Run
app.listen(3000, function () {
    console.log("Server started at port 3000.");
});