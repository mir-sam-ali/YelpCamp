const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const Campground = require('./models/campground')
const seedDB	 = require("./seeds");
const Comment	 = require("./models/comment")
const passport 	 = require("passport")
const LocalStrategy=require("passport-local")
const User		 	= require("./models/user.js")
const campgroundRoutes= require("./routes/campgrounds.js");
const commentRoutes= require("./routes/comments.js");
const authRoutes= require("./routes/index.js");
const methodOverride= require("method-override");
const flash= require('connect-flash');


//Seed the database
//seedDB();
console.log(process.env.DATABASEURL)
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash())
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "My Name Is Sameed",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success")
	next();
});


app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


var port = process.env.PORT || 1000;

app.listen(port,()=>{
	console.log("server is running");
});
