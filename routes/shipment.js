const express = require('express');
const router = express.Router();
const CalculateShipmentCost = require('../utils/rateCalculation');

router.post('/calculate-rate', async (req, res) => {
    try {
        const { origin, destination, weight, invoiceValue, riskType } = req.body;
        const cost = await CalculateShipmentCost(origin, destination, weight, invoiceValue, riskType);
        res.status(200).json(cost);
    } catch (err) {
        res.status(500).json({ error: "Error calculating shipment cost" });
    }
});

module.exports = router;
