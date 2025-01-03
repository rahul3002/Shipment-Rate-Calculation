const mongoose = require('mongoose')

const CityBlockSchema = new mongoose.Schema({
    cityName:{
        type:String,
        required:true
    },
    blockName:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('CityBlock',CityBlockSchema)