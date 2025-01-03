const CityBlock = require('../models/CityBlock');
const RateMatrix = require('../models/RateMatrix');

const CalculateShipmentCost = async (originBlock, destinationBlock, weight, invoiceValue, riskType) => {
    try {
        const originCityBlock = await CityBlock.findOne({cityName: originBlock});
        const destinationCityBlock = await CityBlock.findOne({cityName: destinationBlock});
        
        if (!originCityBlock || !destinationCityBlock) {
            throw new Error("Invalid origin or destination city");
        }

        const rateMatrix = await RateMatrix.findOne({
            OriginBlock: originCityBlock.blockName,
            DestinationBlock: destinationCityBlock.blockName
        });

        if (!rateMatrix) {
            throw new Error("Rate not found for given city blocks");
        }

        // Base freight calculation
        const baseFreight = Math.max(400, weight * rateMatrix.Rate);
        
        // Fuel surcharge (20% of base freight)
        const fuelSurcharge = baseFreight * 0.2;
        
        // DKT charge
        const dktCharge = 100;
        
        // FOV charge calculation
        const fovCharge = riskType === 'owner' 
            ? Math.max(invoiceValue * 0.0005, 50)
            : Math.max(invoiceValue * 0.02, 300);

        // ODA charges
        const oda1 = Math.max(750, weight * 5);
        const oda2 = Math.max(1500, weight * 7);
        
        const totalCost = baseFreight + fuelSurcharge + dktCharge + fovCharge;

        return {
            baseFreight,
            fuelSurcharge,
            dktCharge,
            fovCharge,
            oda1,
            oda2,
            totalCost
        };
    } catch (error) {
        throw error;
    }
};

module.exports = CalculateShipmentCost;

