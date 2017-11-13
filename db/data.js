var mongo = require('mongodb');
var cookieParser = require('cookie-parser')

var url = "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@ds235785.mlab.com:35785/singletempo";
module.exports={
      newUser: function(userInfo,callback){
          mongo.MongoClient.connect(url, function(err,db){

             db.collection('nightLife').findOne({"user": userInfo.user}, function(err,res){
              if(res){
                callback(null,false)
              }
              else if(!res){
              db.collection('nightLife').insert(userInfo, function(err,res){
                            
              })
                callback(null,true)
              }  
        }); 
      })
          
    },
    authenticateUser: function(userInfo, callback){
     mongo.MongoClient.connect(url, function(err,db){
       db.collection('nightLife').findOne({user: userInfo.user, password: userInfo.password}, function(err,result){
          if(result){
          callback(null, true,result)
          }
         else{
           callback(null, false)
         }
        })
     })
   },
  
    addPlace: function(info, callback){
      mongo.MongoClient.connect(url, function(err,db){
        db.collection('nightLife').findOne({user: info.user, places: info.place}, function(err,result){
          if(result){
            callback()
          }
          else if(!result){
         db.collection('nightLife').update({user: info.user},
                                         {$push: {places: info.place }})
        callback()
          }
        })

      })
    },
  
    gatherGoing: function(cerca, callback){
      mongo.MongoClient.connect(url, function(err,db){
        
        db.collection('nightLife').find({places: cerca}).toArray(function(err,result){
            
            var arr =[];
          if(result){
         
            result.forEach((x,i)=>{
     
              arr.push(result[i].user);
               })
            callback(arr);
             }
          else if (!result){
        
               callback(arr);
          }
       

        })
      })
    }
                                 
}