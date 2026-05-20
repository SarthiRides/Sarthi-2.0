const { getDistanceDuration } = require('../services/distanceService');
const { calculateFares } = require('../services/fareService');
const { addSearch, getSearchHistoryByUser, rideTypes } = require('../data/mockStore');

const compareFares = async (req, res) => {
  try {
    const { pickup_lat, pickup_lng, drop_lat, drop_lng, ride_type_id } = req.body;
    const userId = req.user.userId;

    if (!pickup_lat || !pickup_lng || !drop_lat || !drop_lng || !ride_type_id) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const { distance_km, duration_min } = await getDistanceDuration(pickup_lat, pickup_lng, drop_lat, drop_lng);
    const fares = await calculateFares(distance_km, duration_min, ride_type_id);

    if (fares.length === 0) {
      return res.status(404).json({ error: 'No fares available for selected ride type' });
    }

    const topFares = fares.slice(0, 10);
    const cheapestRide = topFares[0]; // Fares are sorted by price in service
    const rideType = rideTypes.find((rt) => rt.id === Number(ride_type_id));

    const search = addSearch({
      user_id: userId,
      distance_km,
      duration_min,
      ride_type: rideType ? rideType.name : null,
      options_count: topFares.length,
      cheapest_fare: cheapestRide.estimated_fare,
      cheapest_provider_logo: cheapestRide.provider_logo, // Save logo for history
    });

    res.json({
      success: true,
      search_id: search.id,
      distance_km: distance_km,
      duration_min: duration_min,
      fares: topFares
    });
  } catch (error) {
    console.error('Compare fares error:', error);
    res.status(500).json({ error: 'Failed to compare fares' });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;
    const history = getSearchHistoryByUser(userId, limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = { compareFares, getSearchHistory };
