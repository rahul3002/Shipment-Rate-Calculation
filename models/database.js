const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rahulbagal7171:8UQgwSQ5g6pYT84A@cluster0.ot6nw.mongodb.net/shipmentapi")

}
module.exports={connectDB };


