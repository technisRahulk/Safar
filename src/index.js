
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./utils/model')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const connectURL='mongodb://127.0.0.1:27017'
const dbname='safar-api'

const app = express()
const publicDir=path.join(__dirname,'./../public')
app.set('views', path.join(__dirname, './../views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(publicDir))

app.post('/update', (req, res) => {
    // MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
    //     if(error){
    //         return console.log('error')
    //     }
    //     const db=client.db(dbname)
    //     db.collection('locations').insertOne({place:req.body.place}, (error, loc) => {
    //       if(error){
    //         return console.log(error)
    //       }
    //       console.log(loc.place)
    //     })
    //     res.render('index', {success: 'Record Inserted Successfully',Places:'Here are the countries'})
    //   })
    MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
      if(error){
          return console.log('error')
      }
      const db=client.db(dbname)
     // setInterval(()=>{
        db.collection('locations').find().forEach(function(loc){
          var place_id = loc._id
          var place_name = loc.place
          geocode(loc.place,(error,{loc,latitude,longitude}={})=>{ 
            if(error){
              return console.log(error)
            }
            
            forecast(latitude,longitude,(error,forecastData)=>{
              if(error){
                return console.log(error)
              }
              db.collection('locations').update({
                _id: place_id
              }, {
                place: place_name,
                temperature: forecastData.temp,
                precipitation: forecastData.precipitation
              })
            })
          })
        })
     // },7000)
    }) 
})
app.get('/rainy', (req, res) => {
  MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client) => {
    if(error){
      return console.log('error')
    }
    const db=client.db(dbname)
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
    res.render('index', {success: `Record Inserted Successfully`,Places:`Here are the countries`})
  })
})

app.get('/warm', (req, res) => {
  MongoClient.connect(connectURL, {useNewUrlParser:true},(error,client) => {
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
   res.render('index', {success: `Record Inserted Successfully`,Places:`Here are the countries`})
  })
})

app.get('/cold', (req, res) => {
  MongoClient.connect(connectURL, {useNewUrlParser:true},(error,client) => {
    if(error){
      return console.log('error')
    }
    const db=client.db(dbname)
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
    res.render('index', {success: `Record Inserted Successfully`,Places:`Here are the countries`})
  })
})
app.get('/', (req, res) => {
    res.render('index', { layout:false,success: ``,Places:``});
  });

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
