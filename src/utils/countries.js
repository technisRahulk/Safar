const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./model')
const geocode=require('./geocode')
const forecast=require('./forecast')

const connectURL='mongodb://127.0.0.1:27017'
const dbname='safar-api'

// MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
//   if(error){
//       return console.log('error')
//   }
//   const db=client.db(dbname)
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


// })


//reading from database based upon some conditions
