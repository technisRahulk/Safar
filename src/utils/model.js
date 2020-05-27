const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/safar-api',{
    useNewUrlParser:true,
    useCreateIndex:true
})

const destination=mongoose.model('locations',{
    place:{
        type:String,
        required:true,
        trim:true        
    },
    precipitation:{
        type:Number,
        trim:true,
        validate(value){
            if(value <0){
                throw new Error("Should be positive!")
            }
        }
    },
    temperature:{
      type:Number,
      trim:true,
      validate(value){
        if(value <0){
            throw new Error("Should be positive!")
        }
    }
    },
    population:{
        type:Number,
        trim:true,
        validate(value){
            if(value <0){
                throw new Error("Should be positive!")
            }
        }
    },
    latitude:{
        type:Number,
        trim:true,
        required:true,
    },
    longitude:{
        type:Number,
        trim:true,
        required:true,       
    }

})
module.exports=destination