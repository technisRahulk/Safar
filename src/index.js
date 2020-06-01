
const express = require('express')
const cities=require('all-the-cities')
const path = require('path')
const hbs=require('hbs')
const bodyParser = require('body-parser')
const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./utils/model')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')
const jsonUtils=require('./utils/utils_json')

const connectURL=process.env.DB
const key = process.env.GOOGLE_API_KEY;
const dbname='safar-api'

const app = express()
const port=process.env.PORT

const publicDir=path.join(__dirname,'./../public')
app.set('views', path.join(__dirname, './../views'));
app.set('view engine', 'hbs');
app.use(express.json())
app.use(express.urlencoded())
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
        var population=0
        const city=cities.find((city)=>city.name==loc.place)
        if(city){
          population=city.population
        }
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
              precipitation: forecastData.precipitation,
              population:population,
              latitude:latitude,
              longitude:longitude
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
    var coor2=[]
    db.collection('locations').find().forEach((loc)=>{
      if(loc.precipitation>0.2){
        var map = 'http://maps.google.com/?q='+loc.place
        var m ={
          place: loc.place,
          precipitation: loc.precipitation,
          temp: loc.temperature,
          maplink: map,
          lat:loc.longitude,
          lng:loc.latitude
        }
        var l={
          lat:loc.longitude,
          lng:loc.latitude,
          name: loc.place
        }
        toGo2.push(m)
        coor2.push(l)//pushing coordinates to the array
      }
  
    }).then(()=>{
     if(toGo2.length==0){
      res.render('index', {success: `Here are the Rainy Places you would love to visit!`,Places:`No such destinations`})
     } else {
      res.render('index', {success: `Here are the Rainy Places you would love to visit!`,Places:toGo2,"coor":jsonUtils.encodeJSON(coor2),"key":jsonUtils.encodeJSON(key)})//added coor2 array to store coordinates
     }
    })
    
  })
})

app.get('/warm',(req, res) => {
  MongoClient.connect(connectURL, {useNewUrlParser:true},(error,client) => {
    if(error){
      return res.send('Cannot connect to database')
    }
    const db=client.db(dbname)
    var toGo=[]
    var coor3=[]
    //for warm places
    db.collection('locations').find().forEach((loc)=>{
     if(loc.temperature>25){
       var map = 'http://maps.google.com/?q='+loc.place
      //  console.log(map)
       var m = {
         place: loc.place,
         precipitation: loc.precipitation,
         temp: loc.temperature,
         maplink: map,
         lat:loc.longitude,
         lng:loc.latitude
       }
       var l={
        lat:loc.longitude,
        lng:loc.latitude,
        name: loc.place
      }
        toGo.push(m)
        coor3.push(l)
     }
    }).then(()=>{
      if(toGo.length==0){
        res.render('index', {success: `Here are the Warm Places you would love to visit!`,Places:`No such destinations`})
      } else {
        res.render('index', {success: `Here are the Warm Places you would love to visit!`,Places:toGo,"coor":jsonUtils.encodeJSON(coor3),"key":jsonUtils.encodeJSON(key)})
      }
    })
    
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
    var coor1=[]
    db.collection('locations').find().forEach((loc)=>{
      if(loc.temperature<19){
        var map = 'http://maps.google.com/?q='+loc.place
        var m = {
          place: loc.place,
          precipitation: loc.precipitation,
          temp: loc.temperature,
          maplink: map,
          lat:loc.longitude,
          lng:loc.latitude
        }
        var l={
          lat:loc.longitude,
          lng:loc.latitude,
          name: loc.place
        }
        toGo1.push(m)
        coor1.push(l)
      }

    }).then(()=>{
      if(toGo1.length==0){
        res.render('index', {success: `Here are the Cold Places you would love to visit!`,Places:`No such destinations`})
      } else {
        res.render('index', {success: `Here are the Cold Places you would love to visit!`,Places:toGo1,"coor":jsonUtils.encodeJSON(coor1),"key":jsonUtils.encodeJSON(key)})
      }
    })
    
  })
})

app.post('/search',(req,res)=>{
  var address=req.body.name
  if(!address){
    return res.render('index',{success:``,Places:``,error:`Address field required`})
  }
  var toGo3=[]
  var coor3=[]
  geocode(address,(error,{location,latitude,longitude}={})=>{ 
      if(error){
          return res.send({error})
      }
      forecast(latitude,longitude,(error,forecastData)=>{
          if(error){
            return res.send({error})
          }
          var map = 'http://maps.google.com/?q='+address
          var m = {
            place:address,
            precipitation:forecastData.precipitation,
            temp: forecastData.temp,
            maplink: map,
            lat:longitude,
            lng:latitude
          }
          var l={
            lat:longitude,
            lng:latitude,
            name: address
          }
          var m1 = {
            place: address,
            precipitation: forecastData.precipitation,
            temp: forecastData.temp
          }
          MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
            if(error){
              return res.send('Cannot connect to database')
            }
            const db=client.db(dbname)
            db.collection('locations').insertOne(m1, function(err, res){
              if (err) throw err
              console.log("Document inserted")
            })
          })
          toGo3.push(m)
          coor3.push(l)
          if(toGo3.length==0){
            res.render('index', {success: ``,Places:`No such destinations`})
           } else {
            res.render('index', {success: `Here is the Place you would love to visit!!`,Places:toGo3,"coor":jsonUtils.encodeJSON(coor3),"key":jsonUtils.encodeJSON(key)})
           }
      })
  })
})

app.get('/', (req, res) => {
    res.render('index', { layout:false,success: ``,Places:``,error:``});
});


app.get('*',(req,res)=>{
  res.send({
      title:'404',
    error:'Error 404:Page not found'
  })
})

app.listen(port, () => console.log("Server is running on port "+port));
