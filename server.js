var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var db = require("./db/data")
var app = express();
var Yelp = require('node-yelp-fusion');
var yelp=new Yelp({ id: process.env.YELP_USER, secret: process.env.YELP_PASS });



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
            console.log(sender)
    	  		res.cookie("locs",sender);
    	  		res.cookie("photos",imgArr);
             res.cookie("going",[])
            res.cookie("eyedees", uniqueId)
              res.redirect("/")
     });

    		      /*  //gathers info for going. Also used in when user logs in    
      var info = req.cookies.eyedees;
      var going = [];
   
info.forEach((x,i)=>{
  
  db.gatherGoing(x, function(g){
    going.push(g)
//    console.log(req.cookies.going.length)
     if(i === info.length-1 && going.length === info.length){
       console.log("GO"+going+going.length)
       res.cookie("going",going)
     
       res.redirect("/")
     }
  })
  
})
   */

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
      res.cookie("uName", result.user)
        //gathers info for going. Also used in when hit search button    
      var info = req.cookies.eyedees
      var going = [];
info.forEach((x,i)=>{
  
  db.gatherGoing(x, function(g){
    //used splice instead of push to get around async problem of wrong order
     //going.push(g) 
    going.splice(i,0,g) 
    if(i === info.length-1){
       console.log(going+going.length)
       res.cookie("going",going)
     
       res.redirect("/")
     }
  })
  
})
     
      
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
            //gathers info for going. Also used in when hit search button    
      var info = req.cookies.eyedees
      var going = [];
info.forEach((x,i)=>{
  
  db.gatherGoing(x, function(g){
    //used splice instead of push to get around async problem of wrong order
     //going.push(g) 
    going.splice(i,0,g) 
    if(i === info.length-1){
       console.log(going+going.length)
       res.cookie("going",going)
     
       res.redirect("/")
     }
  })
  
})  //  res.redirect("/")
  })

})

    app.post("/removePlace", function(req,res){
      var dataObject = {
        user: req.cookies.uName,
        place: req.body.place
      }
      db.removePlace(dataObject, function(){
              var info = req.cookies.eyedees
      var going = [];
info.forEach((x,i)=>{
  
  db.gatherGoing(x, function(g){
    //used splice instead of push to get around async problem of wrong order
     //going.push(g) 
    going.splice(i,0,g) 
    if(i === info.length-1){
       console.log(going+going.length)
       res.cookie("going",going)
     
       res.redirect("/")
     }
  })
  
})  
     
      })
    }) 
    

app.listen(3000,function(req,res){
	console.log("Listening on port 3000...")
})