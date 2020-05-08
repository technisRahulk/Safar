const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./model')
const geocode=require('./geocode')
const forecast=require('./forecast')

const connectURL='mongodb://127.0.0.1:27017'
const dbname='safar-api'
 MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
  if(error){
       return console.log('error')
     }
   const db=client.db(dbname)
   var toGo=[]
   //for warm places
   db.collection('locations').find().forEach((loc)=>{
    if(loc.temperature>25){
        var x =toGo.push(loc.place)
    }

  }).then(()=>{
    console.log("Warm places:")
    if(toGo.length==0){
        return console.log("No such destinations")
    }
    var iterator = toGo.values();
    for (let elements of iterator) { 
      console.log(elements);
    }
  })
  //for cold places
  var toGo1=[]
  db.collection('locations').find().forEach((loc)=>{
    if(loc.temperature<18){
        var x =toGo1.push(loc.place)
    }

  }).then(()=>{
    console.log("Cold places:")
    if(toGo1.length==0){
        return console.log("No such destinations")
    }
    var iterator = toGo1.values();
    for (let elements of iterator) { 
      console.log(elements);
    }
  })
  //rainy places
  var toGo2=[]
  db.collection('locations').find().forEach((loc)=>{
    if(loc.precipitation>0){
        var x =toGo2.push(loc.place)
    }

  }).then(()=>{
    console.log("Rainy places:")
    if(toGo2.length==0){
        return console.log("No such destinations")
    }
    var iterator = toGo2.values();
    for (let elements of iterator) { 
      console.log(elements);
    }
  })


//     db.collection('locations').find().forEach(function(loc){
//       var place_id = loc._id
//       var place_name = loc.place
//       geocode(loc.place,(error,{loc,latitude,longitude}={})=>{ 
//         if(error){
//           return console.log(error)
//         }
        
//         forecast(latitude,longitude,(error,forecastData)=>{
//           if(error){
//             return console.log(error)
//           }
//           db.collection('locations').update({
//             _id: place_id
//           }, {
//             place: place_name,
//             temperature: forecastData.temp,
//             precipitation: forecastData.precipitation
//           })
//         })
//       })
//     })


 })


//reading from database based upon some conditions
