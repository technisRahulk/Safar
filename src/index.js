
const express = require('express')
const path = require('path')
const hbs=require('hbs')
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
app.set('view engine', 'hbs');

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(publicDir))

app.get('/update', (req, res) => {
    MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
      if(error){
        return res.send('Cannot connect to database')
      }
      const db=client.db(dbname)
      db.collection('locations').find().forEach(function(loc){
        var place_id = loc._id
        var place_name = loc.place
        geocode(loc.place,(error,{loc,latitude,longitude}={})=>{ 
          if(error){
            return res.send({error})
          }
          
          forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
              return res.send({error})
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
      res.render('index', {success: `Updated Successfully`,Places:``})
    }) 
})
app.get('/rainy', (req, res) => {
  MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client) => {
    if(error){
      return res.send('Cannot connect to database')
    }
    const db=client.db(dbname)
    var toGo2=[]
    db.collection('locations').find().forEach((loc)=>{
      if(loc.precipitation>0.20){
          toGo2.push(loc.place)
      }
  
    }).then(()=>{
     // var iterator = toGo2.values();
     // for (let elements of iterator) { 
     //   console.log(elements);
     // }
     if(toGo2.length==0){
      return res.render('index', {success: `Rainy places:`,Places:`No such destinations`})
     }
    })
    res.render('index', {success: `Rainy places:`,Places:toGo2})
  })
})

app.get('/warm', (req, res) => {
  MongoClient.connect(connectURL, {useNewUrlParser:true},(error,client) => {
    if(error){
      return res.send('Cannot connect to database')
    }
    const db=client.db(dbname)
    var toGo=[]
    //for warm places
    db.collection('locations').find().forEach((loc)=>{
     if(loc.temperature>35){
        toGo.push(loc.place)
     }
    }).then(()=>{
      if(toGo.length==0){
      return  res.render('index.hbs', {success: `Warm places:`,Places:`No such destinations`})  
      }      
    })
    res.render('index', {success: `Warm places:`,Places:toGo})
  })
})

app.get('/cold', (req, res) => {
  MongoClient.connect(connectURL, {useNewUrlParser:true},(error,client) => {
    if(error){
      return res.send('Cannot connect to database')
    }
    const db=client.db(dbname)
    //for cold places
    var toGo1=[]
    db.collection('locations').find().forEach((loc)=>{
      if(loc.temperature<18){
          toGo1.push(loc.place)
      }

    }).then(()=>{
      if(toGo1.length==0){
        return res.render('index', {success: `Cold places:`,Places:'No such destinations'})
      }
    })
    res.render('index', {success: `Cold places:`,Places:toGo1})
  })
})
app.get('/', (req, res) => {
    res.render('index', { layout:false,success: ``,Places:``,error:``});
  });

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
