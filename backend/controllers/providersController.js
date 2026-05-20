const { providers, rideTypes } = require('../data/mockStore');

const getProviders = async (req, res) => {
  try {
    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRideTypes = async (req, res) => {
  try {
    res.json(rideTypes);
  } catch (error) {
    console.error('Get ride types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProviders, getRideTypes };

