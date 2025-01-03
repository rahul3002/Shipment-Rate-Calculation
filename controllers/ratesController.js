const RateMatrix = require('../models/RateMatrix');

exports.getRates = async (req,res)=>{
    try{
        const rates = await RateMatrix.find({});
        res.status(200).json(rates);
    }catch(err){
        res.status(500).json({error:"Error in Fetching Rates"});
    }
}

exports.updateRate = async (req,res)=>{ 
    try{    
        const { OriginBlock, DestinationBlock, Rate } = req.body;
        
        // Validate input
        if (!OriginBlock || !DestinationBlock || !Rate) {
            return res.status(400).json({error: "Missing required fields"});
        }

        // Try to find existing rate
        let rate = await RateMatrix.findOne({
            OriginBlock: OriginBlock,
            DestinationBlock: DestinationBlock
        });

        if (rate) {
            // Update existing rate
            rate.Rate = Rate;
            await rate.save();
        } else {
            // Create new rate
            rate = new RateMatrix({
                OriginBlock,
                DestinationBlock,
                Rate
            });
            await rate.save();
        }

        res.status(200).json(rate);
    }catch(err){
        console.error('Error:', err);
        res.status(500).json({error: "Error in Updating Rate"});
    }
}