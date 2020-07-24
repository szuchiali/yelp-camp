var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index");

router.get("/", function(req,res){
	//get data form form and add to campgrounds array
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log("error");
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user});
		}
	})
	
});

router.get("/new", middleware.isLogin,function(req,res){
	res.render("campgrounds/new");
});

router.post("/",  middleware.isLogin, function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCampground={name:name,image:image, description:desc,author:author,price:price};
	//create a new campground and save to db 
	Campground.create(newCampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			
			res.redirect("/campgrounds");
			}
	})
});

//SHOW- show more info about one campgrounds
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			return res.redirect("back");
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
});

//EDIT Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
	
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.redirect("back");
		}
		res.render("campgrounds/edit",{campground:foundCampground});
	})
});

router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
	//find and update the currect campground
	//redirect somewhere

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" +req.params.id);
		}
	})
});

//destory campgrounds route

router.delete("/:id",  middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds")
		}
	})
})


function isLogin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				res.redirect("/campgrounds")
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
				
			}
		})
	}else{
		res.redirect("back");
	}
};


module.exports = router;
