var express			=require("express"),
	app				=express(),
	bodyParser		=require("body-parser"),
	Campground		=require("./models/campground"),
	Comment			=require("./models/comment"),
	seedDB			=require("./seeds"),
	passport		=require("passport"),
	LocalStrategy	=require("passport-local"),
	User			=require("./models/user"),
	methodOverride	=require("method-override"),
	flash			=require("connect-flash")

//requiring routes
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// seedDB();//seed the database

app.set("view engine", "ejs");

app.use(flash());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

//Passport configuration
app.use(require("express-session")({
	secret:"Rusty is the best and cutest dog in the world",
	resave :false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

var port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log("YelpCamp Server starts");
});