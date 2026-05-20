const { providers, rideTypes, vehicleCategories } = require('../data/mockStore');

/**
 * Advanced Fare Parity Engine
 * Uses deterministic city-specific rate cards and service fees.
 */
const calculateFares = async (distanceKm, durationMin, rideTypeId) => {
  try {
    const normalizedRideTypeId = Number(rideTypeId);
    const rideType = rideTypes.find((rt) => rt.id === normalizedRideTypeId);
    if (!rideType) throw new Error('Invalid ride type');

    // 1. Determine Deterministic Surge (8AM-11AM, 6PM-9PM)
    const currentHour = new Date().getHours();
    let surgeFactor = 1.0;
    if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 18 && currentHour <= 20)) {
        surgeFactor = 1.45; // Fixed peak surge
    } else if (currentHour >= 22 || currentHour <= 5) {
        surgeFactor = 1.25; // Night charge
    }

    const supportedProviders = providers.filter((p) => p[`supports_${rideType.category}`]);
    const fares = [];

    for (const provider of supportedProviders) {
      const categories = vehicleCategories.filter(
        (cat) => cat.provider_id === provider.id && cat.ride_type_id === normalizedRideTypeId
      );

      for (const cat of categories) {
        // 2. Base Calculation (Standard Tiered Pricing)
        const baseDistance = 2.0;
        const extraDistance = Math.max(0, distanceKm - baseDistance);

        let subtotal = cat.base_fare + (extraDistance * cat.per_km_rate) + (durationMin * cat.per_min_rate);

        // 3. Apply Surge
        subtotal *= surgeFactor;

        // 4. Add Provider Fees
        let bookingFee = 25;
        let insurance = 2.5;

        if (provider.name === 'Namma Yatri') {
            bookingFee = 0;
            insurance = 0;
        }

        // 5. Finalize with Taxes (5% GST)
        const totalFare = (subtotal + bookingFee + insurance) * 1.05;

        fares.push({
          provider_id: provider.id,
          provider_name: provider.name,
          provider_logo: provider.logo_url,
          app_scheme: provider.app_scheme,
          play_store_url: provider.play_store_url,
          intent_uri: provider.intent_uri,
          vehicle_name: cat.name,
          ride_name: rideType.name,
          estimated_fare: Math.round(totalFare),
          estimated_time_min: durationMin,
          surge_applied: surgeFactor > 1.0,
          surge_multiple: surgeFactor,
          distance_km: distanceKm, // CRITICAL FIX: Add distance_km here
          breakdown: {
            base: cat.base_fare,
            distance_fare: Math.round(extraDistance * cat.per_km_rate),
            surge_charge: Math.round(subtotal * (surgeFactor - 1)),
            taxes: Math.round(totalFare * 0.05)
          }
        });
      }
    }

    return fares.sort((a, b) => a.estimated_fare - b.estimated_fare);
  } catch (error) {
    console.error('Calculate fares error:', error);
    return [];
  }
};

module.exports = { calculateFares };
