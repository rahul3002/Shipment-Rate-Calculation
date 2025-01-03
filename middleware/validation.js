const validateShipmentInput = (req, res, next) => {
    const { origin, destination, weight, invoiceValue, riskType } = req.body;
    
    if (!origin || !destination || !weight || !invoiceValue || !riskType) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    if (weight < 40) {
        return res.status(400).json({ error: "Minimum weight should be 40 kg" });
    }
    
    if (!['owner', 'carrier'].includes(riskType)) {
        return res.status(400).json({ error: "Risk type must be either 'owner' or 'carrier'" });
    }
    
    next();
};

module.exports = { validateShipmentInput }; 