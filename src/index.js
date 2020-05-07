
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

app.post('/send', (req, res) => {
    MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            return console.log('error')
        }
        const db=client.db(dbname)
        db.collection('locations').insertOne({place: req.body.place}, (error, loc) => {
          if(error){
            return console.log(error)
          }
          console.log(loc.place)
        })
        res.render('index', {success: 'Record Inserted Successfully'})
        // db.collection('locations').findOne({place:req.body.place},(error,loc)=>{
        //   if(error){
        //     return console.log(error)
        //   }
        //   console.log(loc.place)
          
        //   geocode(loc.place,(error,{location,latitude,longitude}={})=>{ 
        //     if(error){
        //         return console.log(error)
        //     }
            
        //     forecast(latitude,longitude,(error,forecastData)=>{
        //         if(error){
        //             return console.log(error)
        //          }
                
        //         const entry=new destination({
        //           place:loc.place,
        //           precipitation:forecastData.precipitation,
        //           temperature:forecastData.temp
        //         })
                
        //         entry.save().then(()=>{
        //           console.log('Destination added succesfully')
        //         }).catch((error)=>{
        //           console.log(error)
        //         })
        //     })
        //   })
        // })
        // res.render('index', {success: 'Record Inserted Successfully'})
      })
})

app.get('/', (req, res) => {
    res.render('index', { layout:false, success: ''});
  });

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
