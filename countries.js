const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./model')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const connectURL='mongodb://127.0.0.1:27017'
const dbname='safar-api'

MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
  if(error){
      return console.log('error')
  }
  const db=client.db(dbname)
  db.collection('locations').insertOne({place: 'guwahati'}, (error, loc) => {
    if(error){
      return console.log(error)
    }
    console.log(loc.place)
  })
  db.collection('locations').findOne({place:'guwahati'},(error,loc)=>{
    if(error){
      return console.log(error)
    }
    console.log(loc.place)
    
    geocode(loc.place,(error,{location,latitude,longitude}={})=>{ 
      if(error){
          return console.log(error)
      }
      
      forecast(latitude,longitude,(error,forecastData)=>{
          if(error){
              return console.log(error)
           }
          
          const entry=new destination({
            place:loc.place,
            precipitation:forecastData.precipitation,
            temperature:forecastData.temp
          })
          
          entry.save().then(()=>{
            console.log('Destination added succesfully')
          }).catch((error)=>{
            console.log(error)
          })
      })
    })
  })
})


//reading from database based upon some conditions
