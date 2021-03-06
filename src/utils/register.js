const {MongoClient,ObjectID}=require('mongodb')
const destination=require('./model')
const geocode=require('./geocode')
const forecast=require('./forecast')

const connectURL=process.env.DB
const dbname='safar-api'
 MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
   if(error){
       return console.log('error')
      }
    const db=client.db(dbname)
        db.collection('locations').insertOne({place:'Agra'}, (error, loc) => {
          if(error){
            return console.log(error)
          }
          console.log('New Destination added')
        })
})