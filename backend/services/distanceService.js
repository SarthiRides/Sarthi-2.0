const axios = require('axios');
require('dotenv').config();

/**
 * Calculates straight-line distance (Haversine formula) in KM.
 * Used as fallback if Google API fails or key is missing.
 */
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
};

const getDistanceDuration = async (pickupLat, pickupLng, dropLat, dropLng) => {
  // If no API key, use Haversine immediately to save time/errors
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your-google-maps-api-key') {
    const distance_km = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);
    // Rough estimation: 3 minutes per KM in city traffic + 5 min base
    const duration_min = Math.max(5, Math.round(distance_km * 3 + 5));
    return { distance_km, duration_min };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLat},${pickupLng}&destinations=${dropLat},${dropLng}&departure_time=now&traffic_model=best_guess&key=${process.env.GOOGLE_API_KEY}`;
    
    const response = await axios.get(url, { timeout: 8000 });
    const element = response.data.rows[0].elements[0];

    if (element.status !== 'OK') {
      throw new Error(`Distance API error: ${element.status}`);
    }

    const distance = parseFloat(element.distance.value / 1000); // km
    const duration = parseInt(element.duration.value / 60); // minutes

    return { distance_km: distance, duration_min: duration };
  } catch (error) {
    console.warn('Distance service API failed, using Haversine fallback:', error.message);
    const distance_km = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);
    const duration_min = Math.max(5, Math.round(distance_km * 3 + 5));
    return { distance_km, duration_min };
  }
};

module.exports = { getDistanceDuration };
