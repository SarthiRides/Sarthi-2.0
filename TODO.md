# MongoDB Migration TODO - Ride Fare Comparator

## Current Status
✅ React Native frontend complete
✅ Node/Express backend structure complete (MySQL)
❌ Migrate to MongoDB/Mongoose
✅ Features: Auth, Providers, Fares, History

## Breakdown Steps (Approved Plan)

### Phase 1: Dependencies & Config [✅]
- [✅] Update backend/package.json: add mongoose, remove mysql2
- [✅] backend/config/database.js: MongoDB connection
- [ ] .env: Add MONGO_URI (manual)

### Phase 2: Models [✅]
- [✅] Create backend/models/ (User.js, Provider.js, RideType.js, VehicleCategory.js, Search.js, FareResult.js)

### Phase 3: Controllers & Services [✅]
- [✅] authController.js: SQL → Mongoose (register/login)
- [✅] providersController.js: getProviders/getRideTypes → Mongoose.find()
- [✅] faresController.js: compareFares/getSearchHistory → Mongoose
- [✅] fareService.js: Update queries
- [ ] distanceService.js: No change needed

### Phase 4: Seed & Cleanup [✅]
- [✅] backend/database/seed.js: Insert seed data (providers, rideTypes, rates, test user)
- [✅] Delete backend/database/schema.sql

### Phase 5: Docs & Test [ ]
- [ ] Update READMEs/SETUP_GUIDE.md: MongoDB instructions
- [ ] Test: mongod, npm install, node seed.js, npm run dev, Postman APIs
- [ ] Frontend unchanged

## Progress Tracker
- Step 1: Complete → Update TODO

