const CityBlock = require('../models/CityBlock');
const RateMatrix = require('../models/RateMatrix');

const CalculateShipmentCost = async (originBlock, destinationBlock, weight, invoiceValue, riskType) => {
    try {
        // Input validation
        if (!originBlock || !destinationBlock || !weight || !invoiceValue || !riskType) {
            throw new Error("All fields are required");
        }

        const originCityBlock = await CityBlock.findOne({blockName: originBlock});
        const destinationCityBlock = await CityBlock.findOne({blockName: destinationBlock});
        
        if (!originCityBlock || !destinationCityBlock) {
            throw new Error("Invalid origin or destination city block");
        }

        const rateMatrix = await RateMatrix.findOne({
            OriginBlock: originBlock,
            DestinationBlock: destinationBlock
        });

        if (!rateMatrix) {
            throw new Error("Rate not found for given city blocks");
        }

        // Base freight calculation (minimum 400)
        const baseFreight = Math.max(400, weight * rateMatrix.Rate);
        
        // Fuel surcharge (20% of base freight)
        const fuelSurcharge = baseFreight * 0.2;
        
        // DKT charge (fixed 100)
        const dktCharge = 100;
        
        // FOV charge calculation
        const fovCharge = riskType === 'owner' 
            ? Math.max(invoiceValue * 0.0005, 50)  // 0.05%
            : Math.max(invoiceValue * 0.02, 300);   // 2%

        // ODA charges calculation
        // Assuming ODA2 for destinations in "Rest of CG" or "REST of Vidharva"
        const isODA2 = ['Rest of CG', 'REST of Vidharva'].includes(destinationBlock);
        const odaCharges = isODA2 
            ? Math.max(1500, weight * 7)  // ODA2
            : Math.max(750, weight * 5);   // ODA1

        // Appointment charges
        const appointmentCharges = Math.max(1200, weight * 5);

        // Total cost
        const totalCost = baseFreight + fuelSurcharge + dktCharge + fovCharge + odaCharges + appointmentCharges;

        return {
            baseFreight,
            fuelSurcharge,
            dktCharges: dktCharge,
            fovCharges: fovCharge,
            odaCharges,
            appointmentCharges,
            totalCost
        };
    } catch (error) {
        throw error;
    }
};

module.exports = CalculateShipmentCost;

