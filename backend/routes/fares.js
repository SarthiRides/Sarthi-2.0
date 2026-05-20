const express = require('express');
const authMiddleware = require('../middleware/auth');
const { compareFares, getSearchHistory } = require('../controllers/faresController');
const router = express.Router();

router.post('/compare-fares', authMiddleware, compareFares);
router.get('/search-history', authMiddleware, getSearchHistory);

module.exports = router;

