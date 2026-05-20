const express = require('express');
const { getProviders, getRideTypes } = require('../controllers/providersController');
const router = express.Router();

router.get('/providers', getProviders);
router.get('/ride-types', getRideTypes);

module.exports = router;

