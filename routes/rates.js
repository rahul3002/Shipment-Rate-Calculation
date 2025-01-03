const express = require('express');
const router = express.Router();
const { getRates, updateRate } = require('../controllers/ratesController');

router.get('/', getRates);
router.post('/update', updateRate);

module.exports = router;
