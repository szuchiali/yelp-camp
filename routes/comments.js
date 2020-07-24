var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/index");


router.get("/new",middleware.isLogin,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if (err){
			console.log("error");
		}else{
			res.render("comments/new",{campground:campground});
		}
	})
});

router.post("/",middleware.isLogin,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log("error");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log("err");
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id);
				}
			})
		}
	})
});

//Comment edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
			}
		})	
	});	
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if (err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//findById and remove
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

function isLogin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("/campgrounds")
			}else{
				if(foundComment.author.id.equals(req.user._id)){
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
