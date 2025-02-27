//all the middleware
var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err || !foundCampground){
				req.flash("error","Campground not found");
				res.redirect("/campgrounds");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission");
					res.redirect("back");
				}
				
			}
		})
	}else{
		req.flash("error", "Please Login First");
		res.redirect("/campgrounds");
	}
	
}


middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err ||!foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission");
					res.redirect("back");
				}
				
			}
		})
	}else{
		req.flash("error","Please login first");
		res.redirect("/campgrounds");
	}
}

middlewareObj.isLogin=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first");
	res.redirect("/login");
};

module.exports=middlewareObj;