const express = require('express');
const router = express.Router();
const CalculateShipmentCost = require('../utils/rateCalculation');

router.post('/calculate-rate', async (req, res) => {
    try {
        const { origin: originBlock, destination: destinationBlock, weight, invoiceValue, riskType } = req.body;
        
        const cost = await CalculateShipmentCost(
            originBlock,
            destinationBlock,
            weight,
            invoiceValue,
            riskType
        );
        
        res.status(200).json(cost);
    } catch (err) {
        console.error('Calculation Error:', err);
        res.status(400).json({ 
            error: err.message || "Error calculating shipment cost" 
        });
    }
});

module.exports = router;
