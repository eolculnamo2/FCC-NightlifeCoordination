var mongo = require('mongodb');
var cookieParser = require('cookie-parser')

var url = "mongodb://eolculnamo2:ghost12@ds235785.mlab.com:35785/singletempo";
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
    
  }
}