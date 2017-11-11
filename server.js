var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express();
var Yelp = require('node-yelp-fusion');
var yelp=new Yelp({ id:"rGdNsmucbSDO38xCi10UiQ" , secret:"F2eU5bGtTjQm6BhCbaf9zHyGZpmGcikh2H6fUtSnwWp68dYphIaXUTi7YAZafF6I" });



app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/", function(req,res){
	res.sendFile(__dirname+"/views/index.html")
})


app.post("/searching", function(req,res){
	   
	var search = {
	 location: req.body.city
	}
	//sender is the array to go to cookies for display for location names via locs cookie
	var sender = []
	var imgArr = []
	yelp.search("categories=nightlife&location="+search.location)
    .then(function(result){
   		result["businesses"].forEach((x)=>{
    		sender.push(x.name)
    		imgArr.push(x.image_url)
    	})    	   	  
    	  		res.cookie("locs",sender);
    	  		res.cookie("photos",imgArr);
    		res.redirect("/")
        });

})
app.listen(3000,function(req,res){
	console.log("Listening on port 3000...")
})