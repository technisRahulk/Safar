const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./model')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const connectURL='mongodb://127.0.0.1:27017'
const dbname='task-manager-api'

MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
  if(error){
      return console.log('error')
  }
  const db=client.db(dbname)
  db.collection('locations').findOne({place:'paris'},(error,loc)=>{
    if(error){
      return console.log(error)
    }
    console.log(loc.place)
    //converting place name to coordinates using geocode
    geocode(loc.place,(error,{location,latitude,longitude}={})=>{ 
      if(error){
          return console.log(error)
      }
      //fetching forecastdata
      forecast(latitude,longitude,(error,forecastData)=>{
          if(error){
              return console.log(error)
           }
          //writing details into the database
          const entry=new destination({
            place:loc.place,
            precipitation:forecastData.precipitation,
            temperature:forecastData.temp
          })
          //saving the work in the DB
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
