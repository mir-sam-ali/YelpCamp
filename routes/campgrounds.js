var express= require('express');
var router= express.Router();
const Campground = require('../models/campground')

const middleware=require('../middleware')

router.get('/',function(req,res){
	//Get all campgrounds from db
	Campground.find({},function(err,allCampgrounds){
		if(err)
			console.log(err);
		else{
			//console.log(router);
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
	
}); 


router.post('/',middleware.isLoggedIn,function(req,res){
	
	//get data from form and add to campforunds array
	var campName= req.body.campName;
	
	var price=req.body.price;
	var url= req.body.image;
	var desc= req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newCampground={name: campName,price:price, image: url, description:desc,author:author};
	//create new campground and save to db
	
	Campground.create(newCampground,function(err,newlyCreated){
		if(err)
			console.log(err);
		else{
				//redirect to campgrounds
	res.redirect('/campgrounds');
		}
	});
	
	

	
});
router.get('/new',middleware.isLoggedIn,function(req,res){
	
	res.render('campgrounds/new');
	
});


//SHOW route
router.get('/:id',function(req,res){
	Campground.findById(req.params.id).populate("comments").populate("likes").exec(function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			
			
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
});
//EDIT And Update

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
		
	Campground.findById(req.params.id,function(err,foundCampground){
		
			
			
			res.render("campgrounds/edit",{campground:foundCampground});
			
		})
})
//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//console.log(req.body.campground)
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err)
			res.redirect("/campgrounds");
		else
			//console.log(updatedCampground)
			res.redirect("/campgrounds/"+req.params.id);
	})
})

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds")
	})
})

//Likes

router.post("/:id/like",middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
			{
				console.log("errrr")
				console.log(err);
				res.redirect("/");
			}
		else{
			var found= foundCampground.likes.some(function(likedId){
				return likedId.equals(req.user._id);
			})
			if(found){
				foundCampground.likes.pull(req.user._id);
				
			}else{
				foundCampground.likes.push(req.user._id);
			}
			foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
		}
)
}})
	})


module.exports= router;