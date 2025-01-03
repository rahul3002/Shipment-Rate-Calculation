const express = require('express');
const {connectDB} = require("./models/database")
const app = express();
app.use(express.json());

const PORT = 5000;

connectDB().then(() => {
    console.log("Connected to DB");
    app.listen(PORT, ()=>{
        console.log(`<< Server is Ruuning at ${PORT}`);
    })
}).catch(() => {
    console.log("Error in connecting to DB")
});