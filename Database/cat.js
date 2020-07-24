const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catSchema=new mongoose.Schema({
	name:String,
	age:Number,
	temperament:String
});

var Cat=mongoose.model("Cat",catSchema);

Cat.create({
	name:"snow",
	age:13,
	temperament:"Bland"
}, function(err,cats){
	if(err){
		console.log("error");
	}else{
		console.log(cats);
	}
});

Cat.find({},function(err,cats){
	if(err){
		console.log("Error");
	}else{
		console.log("All the cats");
		console.log(cats);
	}
})

// var george=new Cat({
// 	name:"Philll",
// 	age:7,
// 	temperament:"Evil"
// })


// george.save(function(err,cat){
// 	if(err){
// 		console.log("Something went wrong")
// 	}else{
// 		console.log("we just save a cat to db")
// 		console.log(cat);
// 	}
// })