const mongoose = require('mongoose');
const RateMatrixSchema = new mongoose.Schema({
    OriginBlock:{
        type:String,
        required:true
    },
    DestinationBlock:{
        type:String,
        required:true
    },
    Rate:{
        type:Number,
        required:true
    }
})  
module.exports = mongoose.model('RateMatrix',RateMatrixSchema)