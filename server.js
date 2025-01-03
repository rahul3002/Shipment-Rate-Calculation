const express = require('express');
const { connectDB } = require("./models/database");
const ratesRouter = require('./routes/rates');
const cityBlocksRouter = require('./routes/cityBlocks');
const shipmentRouter = require('./routes/shipment');
const { validateShipmentInput } = require('./middleware/validation');

const app = express();
app.use(express.json());

// Routes
app.use('/rates', ratesRouter);
app.use('/city-blocks', cityBlocksRouter);
app.use('/shipment', shipmentRouter);

// Add validation middleware to calculate-rate endpoint
app.use('/shipment/calculate-rate', validateShipmentInput);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log("Error in connecting to DB:", err);
});