const CityBlock = require('../models/CityBlock');

exports.getCityBlocks = async (req,res)=>{
    try{
        const cityBlocks = await CityBlock.find({});
        res.status(200).json(cityBlocks);
    }catch(err){
        res.status(500).json({err:"Error in Fetching City Blocks"});
    }
}

exports.addCityBlock = async (req,res)=>{
    try{
        const cityBlock = new CityBlock(req.body);
        await cityBlock.save();
        res.status(201).json(cityBlock);
    }catch(err){
        res.status(500).json({err:"Error in Adding City Block"});
    }
}