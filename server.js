var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var db = require("./db/data")
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

//Search Function: Collects queried data and sends to cookies
app.post("/searching", function(req,res){
	   
	var search = {
	 location: req.body.city
	}
	//sender is the array to go to cookies for display for location names via locs cookie
	var sender = []
	var imgArr = []
  var uniqueId = []
	yelp.search("categories=nightlife&location="+search.location)
    .then(function(result){
   		result["businesses"].forEach((x)=>{
    		sender.push(x.name)
    		imgArr.push(x.image_url)
        uniqueId.push(x.id)
    	})    	   	  
            console.log(result.businesses)
    	  		res.cookie("locs",sender);
    	  		res.cookie("photos",imgArr);
            res.cookie("eyedees", uniqueId)
    		res.redirect("/")
        });

});

//Register New User
app.post("/register", function(req,res){
  
  if(req.body.password !== req.body.confirm){
    res.send("Passwords Do Not Match")
  }
  
  else{
  var dataObject = {
    user: req.body.user,
    password: req.body.password,
    places: []
  }
  
  db.newUser(dataObject, function(err, result){
    if(!result){
      res.send("User already exists")
    }
    else if(result){
      res.redirect("/")
    }
  });
  }
});

//Login
app.post("/login", function(req,res){
  var dataObject = {
    user: req.body.user,
    password: req.body.password
  }
  
  db.authenticateUser(dataObject, function(err,test, result){
    if(test){
      console.log(result)
      res.cookie("uName", result.user)
      res.redirect("/")
    }
    else if(!test){
      res.send("Invalid Credentials")
    }
  })
})
//logout
app.get("/logout", function(req,res){
  res.clearCookie("uName")
  res.redirect("/")
})

//going event handling... adds a place
app.post("/addPlace", function(req,res){
  var dataObject = {
    user: req.cookies.uName,
    place: req.body.place
  }
  db.addPlace(dataObject, function(){
      res.redirect("/")
  })

})
app.listen(3000,function(req,res){
	console.log("Listening on port 3000...")
})