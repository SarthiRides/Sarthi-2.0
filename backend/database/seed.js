const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Provider = require('../models/Provider');
const RideType = require('../models/RideType');
const VehicleCategory = require('../models/VehicleCategory');
const User = require('../models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ride_fare_comparator')
  .then(async () => {
    console.log('Seeding database...');

    // Clear existing data
    await Provider.deleteMany({});
    await RideType.deleteMany({});
    await VehicleCategory.deleteMany({});
    await User.deleteMany({});

    // Providers
    await Provider.insertMany([
      { name: 'Ola', logoUrl: 'https://logo.clearbit.com/ola.com', appScheme: 'olacabs://', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.olacabs.customer', supportsBike: true, supportsAuto: true, supportsCab: true, supportsParcel: true, supportsRental: true },
      { name: 'Uber', logoUrl: 'https://logo.clearbit.com/uber.com', appScheme: 'uber://', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab', supportsBike: true, supportsCab: true, supportsParcel: true },
      { name: 'Namma Yatri', logoUrl: 'https://nammayatri.in/logo.png', appScheme: 'nammayatri://', playStoreUrl: 'https://play.google.com/store/apps/details?id=in.yatri', supportsBike: true, supportsAuto: true },
      { name: 'Rapido', logoUrl: 'https://logo.clearbit.com/rapido.bike', appScheme: 'rapido://', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.rapido', supportsBike: true, supportsAuto: true },
      { name: 'Yulu', logoUrl: 'https://yulu.in/logo.png', appScheme: 'yulu://', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.yulu.bike', supportsBike: true, supportsRental: true },
      { name: 'Porter', logoUrl: 'https://logo.clearbit.com/porter.in', appScheme: 'porter://', playStoreUrl: 'https://play.google.com/store/apps/details?id=in.porter.customer', supportsParcel: true }
    ]);

    // Ride Types
    await RideType.insertMany([
      { name: 'Bike', description: 'Two-wheeler ride', category: 'bike' },
      { name: 'Auto', description: 'Three-wheeler ride', category: 'auto' },
      { name: 'Mini Cab', description: 'Compact car', category: 'cab' },
      { name: 'Sedan Cab', description: 'Sedan car', category: 'cab' },
      { name: 'SUV Cab', description: 'SUV car', category: 'cab' },
      { name: 'Parcel Small', description: 'Small package delivery', category: 'parcel' },
      { name: 'Parcel Medium', description: 'Medium package delivery', category: 'parcel' },
      { name: 'Parcel Large', description: 'Large package delivery', category: 'parcel' },
      { name: 'Rental Bike', description: 'Hourly bike rental', category: 'rental' },
      { name: 'Rental Car', description: 'Hourly car rental', category: 'rental' }
    ]);

    // Wait for IDs
    const providers = await Provider.find({});
    const rideTypes = await RideType.find({});

    // Vehicle Categories (sample rates)
    await VehicleCategory.insertMany([
      { providerId: providers[0]._id, rideTypeId: rideTypes[0]._id, name: 'Ola Bike', baseFare: 15.00, perKmRate: 5.00, perMinRate: 1.00 },
      { providerId: providers[0]._id, rideTypeId: rideTypes[1]._id, name: 'Ola Auto', baseFare: 25.00, perKmRate: 8.00, perMinRate: 1.50 },
      { providerId: providers[0]._id, rideTypeId: rideTypes[2]._id, name: 'Ola Mini', baseFare: 50.00, perKmRate: 12.00, perMinRate: 2.00 },
      { providerId: providers[1]._id, rideTypeId: rideTypes[0]._id, name: 'Uber Bike', baseFare: 18.00, perKmRate: 6.00, perMinRate: 1.20 },
      { providerId: providers[1]._id, rideTypeId: rideTypes[2]._id, name: 'Uber Go', baseFare: 45.00, perKmRate: 11.00, perMinRate: 1.80 },
      { providerId: providers[2]._id, rideTypeId: rideTypes[0]._id, name: 'NY Bike', baseFare: 12.00, perKmRate: 4.50, perMinRate: 0.90 },
      { providerId: providers[3]._id, rideTypeId: rideTypes[0]._id, name: 'Rapido Bike', baseFare: 14.00, perKmRate: 5.50, perMinRate: 1.10 },
      { providerId: providers[4]._id, rideTypeId: rideTypes[0]._id, name: 'Yulu Bike', baseFare: 10.00, perKmRate: 3.00, perMinRate: 0.00 },
      { providerId: providers[5]._id, rideTypeId: rideTypes[5]._id, name: 'Porter Small', baseFare: 30.00, perKmRate: 10.00, perMinRate: 0.00 }
    ]);

    // Test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await User.create({ email: 'test@example.com', password: hashedPassword, name: 'Test User' });

    console.log('✅ Seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });

