const request=require('request')
var os = require('os')

const forecast=(latitude,longitude,callback)=>{
    const url='https://api.darksky.net/forecast/428359332ff7c0eff87b2f6dd18deb8a/'+ longitude + ',' + latitude + '?units=si'
    request({url,json:true},(error,{body}={})=>{
        if(error){
            callback("Weather app not accessed",undefined)
        }
        else if(body.error){
            callback('Unable to find the location',undefined)
        }
        else{
            const temp=body.currently.temperature
            const precipitation=body.currently.precipProbability
            callback(undefined,{temp,precipitation})
    
        }
         
    })

}
module.exports=forecast