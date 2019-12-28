var express= require('express');
var router= express.Router();
const passport 	 = require("passport")
const User		 	= require("../models/user.js")

router.get('/',(req,res)=>{
	res.render("landing");

});




//============
//AUTH ROUTES
//============

//signup
router.get("/register",(req,res)=>{
	res.render("register")
})

router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username});
	
	User.register(newUser,req.body.password,function(err,user){
		if(err){ 
			req.flash('error',err.message)
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success ","Welcome to Yelpcamp "+user.username)
			res.redirect("/campgrounds");
		}) 
	})
	

})

//show Login Form

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}),(req,res)=>{});

router.get('/logout',function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect('/campgrounds');
})

//middleware


module.exports= router;