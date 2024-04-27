const mongoose=require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')


//define the schema for doctor model
const doctorSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required:true,
    },
    specialization:{
        type:String,
        requried:true,
    },
    yearsOfService:{
        type:Number,
        requried:true,
    },
    availability:{
        type:[String],
        default:[],
    },

});

doctorSchema.plugin(passportLocalMongoose);

//create the doctor model from the schema
const Doctor=mongoose.model('Doctor',doctorSchema)

module.exports=Doctor