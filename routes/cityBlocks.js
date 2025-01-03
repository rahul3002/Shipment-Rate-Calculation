const express = require('express');
const router = express.Router();
const { getCityBlocks, addCityBlock } = require('../controllers/cityBlocksController');

router.get('/', getCityBlocks);
router.post('/add', addCityBlock);

module.exports = router;