# Ride Fare Comparator - Complete Production-Ready App

A cross-platform mobile and web application built with React Native, Node.js/Express, and MySQL that allows users to compare ride fares across multiple providers (Ola, Uber, Namma Yatri, Rapido, Yulu, Porter).

## Features

- **Multi-Provider Fare Comparison**: Compare prices across 6+ ride providers in one place
- **Real-Time Fare Calculation**: Uses Google Distance Matrix API for accurate distance/duration
- **Multiple Ride Types**: Bike, Auto, Cab (Mini/Sedan/SUV), Parcel, Rental
- **User Authentication**: Secure JWT-based authentication system
- **Search History**: Track all previous fare comparisons
- **Deep Linking**: Direct integration with provider apps for booking
- **Maps Integration**: Interactive maps with route visualization
- **Geolocation**: Automatic current location detection

## Tech Stack

### Frontend
- **React Native 0.74.1** with CLI (not Expo)
- React Navigation (Stack + Bottom Tabs)
- Zustand for state management
- Axios for API calls
- React Native Maps with Geolocation
- React Native Vector Icons

### Backend
- **Node.js 18+** with Express.js
- MySQL 8.0+ database
- JWT authentication with bcryptjs
- Google Distance Matrix API integration
- Helmet (security), CORS, Rate Limiting

### Database
- **MySQL 8.0+**
- Fully normalized schema with seed data
- 6 tables: users, providers, ride_types, vehicle_categories, searches, fare_results
- Includes 6 providers with realistic pricing

## Folder Structure

```
RideFareComparator/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── faresController.js
│   │   └── providersController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── fares.js
│   │   └── providers.js
│   ├── services/
│   │   ├── distanceService.js
│   │   └── fareService.js
│   └── database/
│       └── schema.sql
├── frontend/
│   ├── App.js
│   ├── index.js
│   ├── app.json
│   ├── metro.config.js
│   ├── package.json
│   ├── node_modules/
│   └── src/
│       ├── screens/
│       │   ├── LoginScreen.js
│       │   ├── RegisterScreen.js
│       │   ├── HomeScreen.js
│       │   ├── ResultsScreen.js
│       │   └── HistoryScreen.js
│       ├── services/
│       │   └── api.js
│       └── stores/
│           └── authStore.js
├── TODO.md
├── README.md
└── README_COMPLETE.md (this file - full documentation)
```

## Quick Start Guide

### Prerequisites
- **Node.js** >= 18
- **MySQL** 8.0+
- **Android SDK** (for Android development) or **Xcode** (for iOS)
- **Google Maps API Key** [Get here](https://developers.google.com/maps/documentation/distance-matrix/get-api-key)

### Step 1: Database Setup

```bash
# Using MySQL CLI
mysql -u root -p < backend/database/schema.sql

# Verify the database was created
mysql -u root -p -e "USE ride_fare_comparator; SHOW TABLES;"
```

**Test user credentials:**
- Email: `test@example.com`
- Password: `password123`

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# .env file already exists with template values
# Update these with your actual values:
# - DB_PASSWORD: your MySQL root password
# - GOOGLE_API_KEY: your Google Maps API key

# Test the setup
npm run dev
# Output: 🚀 Server running on port 3001
```

Access health check: http://localhost:3001/health

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies (should already be done, but just in case)
npm install

# Link native icons
npx react-native link react-native-vector-icons

# Start Metro bundler (keep this terminal running)
npx react-native start

# In a NEW TERMINAL, run on your device/emulator
npx react-native run-android
# OR for iOS
npx react-native run-ios
```

## Complete Test Flow

### 1. API Testing (Postman/Insomnia)

**Register New User**
```http
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Login**
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
Copy the returned **token** value for next requests.

**Get Providers**
```http
GET http://localhost:3001/api/providers/providers
Authorization: Bearer YOUR_COPIED_TOKEN_HERE
```

**Get Ride Types**
```http
GET http://localhost:3001/api/providers/ride-types
Authorization: Bearer YOUR_COPIED_TOKEN_HERE
```

**Compare Fares**
```http
POST http://localhost:3001/api/fares/compare-fares
Authorization: Bearer YOUR_COPIED_TOKEN_HERE
Content-Type: application/json

{
  "pickup_lat": 12.9716,
  "pickup_lng": 77.5946,
  "drop_lat": 12.9279,
  "drop_lng": 77.6276,
  "ride_type_id": 1
}
```

**Get Search History**
```http
GET http://localhost:3001/api/fares/search-history?limit=10
Authorization: Bearer YOUR_COPIED_TOKEN_HERE
```

### 2. Frontend Testing

1. **Launch the app** on Android emulator or device
2. **Register or Login** using test credentials
3. **Home Screen**:
   - Tap "Current Location" to get your location
   - App will request location permission (grant it)
   - View available ride types (Bike, Auto, Cab, etc.)
4. **Select Ride Type**: Tap Bike (or any ride type)
5. **Swap Locations**: Tap ↕️ button to swap pickup and drop
6. **Compare Prices**: Tap "Compare Prices" button
7. **Results Screen**: See all providers sorted by cheapest fare
8. **Book Ride**: Tap "Book" to open provider app (if installed)
9. **History**: Tap "History" tab to see previous searches

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Register a new user
- No authentication required
- Body: `{ email, password, name, phone }`
- Returns: `{ token, user }`

**POST /api/auth/login**
- Login and get JWT token
- No authentication required
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Provider Endpoints

**GET /api/providers/providers**
- Get list of all ride providers
- Requires: Bearer token
- Returns: Array of providers with their details

**GET /api/providers/ride-types**
- Get available ride types
- Requires: Bearer token
- Returns: Array of ride types (Bike, Auto, Cab, Parcel, Rental)

### Fare Endpoints

**POST /api/fares/compare-fares**
- Compare fares across providers
- Requires: Bearer token
- Body: `{ pickup_lat, pickup_lng, drop_lat, drop_lng, ride_type_id }`
- Returns: `{ success, search_id, distance_km, duration_min, fares }`

**GET /api/fares/search-history**
- Get user's search history
- Requires: Bearer token
- Query params: `limit=10` (default)
- Returns: Array of previous searches with cheapest fare

### Health Endpoint

**GET /health**
- Check API health
- No authentication required
- Returns: `{ status: "OK", timestamp }`

## Configuration

### Backend Environment Variables

File: `backend/.env`

```env
# Server Configuration
PORT=3001                                    # API port
FRONTEND_URL=http://localhost:8081          # CORS origin

# Database Configuration
DB_HOST=localhost                            # MySQL host
DB_USER=root                                 # MySQL username
DB_PASSWORD=yourpassword                     # MySQL password
DB_NAME=ride_fare_comparator                # Database name

# Authentication
JWT_SECRET=super-secret-key-change-this     # Must be 32+ chars
JWT_EXPIRE=7d                               # Token expiry

# Google APIs
GOOGLE_API_KEY=AIzaSyD...                   # Distance Matrix API key

# Optional
REDIS_URL=redis://localhost:6379            # For caching (optional)
```

### Frontend Configuration

File: `frontend/src/services/api.js`

```javascript
// For Android Emulator (default)
const API_BASE_URL = 'http://10.0.2.2:3001/api';

// For Physical Device or Custom Backend
// const API_BASE_URL = 'http://192.168.x.x:3001/api';
// const API_BASE_URL = 'https://your-backend-url.com/api';
```

## Running the Application

### Terminal 1: Start MySQL
```bash
# Mac
mysql.server start

# Linux
sudo systemctl start mysql

# Windows (if installed via installer)
# Use MySQL Workbench or Services app
```

### Terminal 2: Start Backend
```bash
cd backend
npm run dev
# Output: 🚀 Server running on port 3001
```

### Terminal 3: Start Frontend Metro
```bash
cd frontend
npx react-native start
# Press 'a' for Android or 'i' for iOS
```

### Terminal 4 (Optional): Run on Device
```bash
cd frontend
npx react-native run-android
# Or iOS
npx react-native run-ios
```

## Key Implementation Details

### Authentication Flow
1. User registers with email, password, name, phone
2. Password hashed with bcryptjs (12 rounds)
3. JWT token issued on successful login/register
4. Token stored in AsyncStorage (survives app restart)
5. Token auto-restored on app launch
6. All protected endpoints require `Authorization: Bearer TOKEN` header

### Fare Calculation
1. Get distance & duration from Google Distance Matrix API
2. Falls back to mock values (2.5km, 10min) if API fails
3. For each provider supporting the ride type:
   - Calculate: `base_fare + (km × per_km_rate) + (min × per_min_rate)`
   - Return sorted by lowest fare first

### Database Schema
- **Users**: Email, hashed password, profile info
- **Providers**: 6 providers with app schemes & Play Store links
- **Ride Types**: 5 categories (bike/auto/cab/parcel/rental)
- **Vehicle Categories**: Provider + ride type combinations with rates
- **Searches**: User's fare comparison queries
- **Fare Results**: Prices from each provider per search

### State Management (Zustand)
- **authStore**: User login state, token management, API auth headers
- Persisted to AsyncStorage automatically
- Auto-login on app restart if token valid

### Maps & Location
- React Native Maps for displaying route
- Geolocation Service for current location
- Polyline visualization between pickup and drop

## Troubleshooting

### Database Issues

**"Error: connect ECONNREFUSED 127.0.0.1:3306"**
```bash
# Verify MySQL is running
mysql -u root -p

# If not running, start it
mysql.server start        # Mac
sudo systemctl start mysql # Linux
```

**"Access denied for user 'root'@'localhost'"**
- Check password in `.env` matches your MySQL root password
- Reset password if needed: `mysql -u root FLUSH PRIVILEGES;`

### Backend Issues

**"Error: Invalid API key"** (Google Maps)
- Get an API key: [Google Cloud Console](https://console.cloud.google.com)
- Enable "Distance Matrix API"
- Add key to `.env` as `GOOGLE_API_KEY`
- Wait 5 minutes for key to activate

**"TypeError: Cannot read property 'rows'"** (from Distance Service)
- Indicates Google API call failed
- Check internet connection
- Verify API key is valid
- Check API quota in Google Cloud Console

### Frontend Issues

**"Java.lang.RuntimeException: Unable to load script"**
```bash
cd frontend
npm start -- --reset-cache
# Then in new terminal
npx react-native run-android
```

**Location Permission Denied**
- Android: Grant permission when prompted
- iOS: Add to `Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to compare fares</string>
```

**"Cannot find module 'react-native-vector-icons'"**
```bash
cd frontend
npx react-native link react-native-vector-icons
npm start -- --reset-cache
npx react-native run-android
```

**Maps Not Showing**
- Android: Add Google Maps API key to `AndroidManifest.xml`
- iOS: Add API key to `AppDelegate.m`
- Wait 10 minutes after creating API key

### Common Errors

| Error | Solution |
|-------|----------|
| `TypeError: api is not defined` | Check api.js imports in screens |
| `useAuthStore is not a function` | Verify authStore.js exports default |
| `EADDRINUSE: address already in use :::3001` | Kill process: `lsof -ti:3001 \| xargs kill -9` |
| `Metro bundler crashed` | Clear cache: `npm start -- --reset-cache` |
| `App keeps asking for location` | Grant permission and restart app |

## Performance Optimization

### Implemented
- ✅ Parameterized SQL queries (prevent injection)
- ✅ Geolocation caching during session
- ✅ Async token restoration
- ✅ Rate limiting (100 req/15 min)
- ✅ JSON response compression

### Future Improvements
- Redis caching for distance/fare queries
- Implement pagination for history
- Optimize map rendering with clustering
- Database connection pooling
- Image optimization for provider logos
- Code splitting in React Native

## Security Best Practices

### Implemented
- ✅ JWT-based stateless authentication
- ✅ Password hashing (bcryptjs - 12 rounds)
- ✅ CORS configured for specific origin
- ✅ Helmet.js security headers
- ✅ Rate limiting per IP
- ✅ SQL injection prevention (parameterized queries)
- ✅ Token expiry (7 days default)

### Production Checklist
- [ ] Change `JWT_SECRET` to 32+ random characters
- [ ] Use HTTPS/SSL certificates
- [ ] Enable database backups
- [ ] Use strong MySQL root password
- [ ] Deploy behind reverse proxy (nginx)
- [ ] Monitor API logs and errors
- [ ] Set up error alerting (Sentry, etc.)
- [ ] Keep dependencies updated
- [ ] Use environment-specific configs

## Deployment

### Backend Deployment (Railway Example)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Set environment variables
railway variables:set DB_PASSWORD=xxxxx
railway variables:set GOOGLE_API_KEY=xxxxx
railway variables:set JWT_SECRET=xxxxx

# Deploy
railway up

# View logs
railway logs
```

### Frontend Deployment (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
cd frontend
eas init

# Build for both platforms
eas build --platform all

# Submit to stores
eas submit --platform android --latest
eas submit --platform ios --latest
```

## Providers Supported

| Provider | Bike | Auto | Cab | Parcel | Rental | Deep Link |
|----------|------|------|-----|--------|--------|-----------|
| Ola | ✅ | ✅ | ✅ | ✅ | ✅ | olacabs:// |
| Uber | ✅ | ❌ | ✅ | ✅ | ❌ | uber:// |
| Namma Yatri | ✅ | ✅ | ❌ | ❌ | ❌ | nammayatri:// |
| Rapido | ✅ | ✅ | ❌ | ❌ | ❌ | rapido:// |
| Yulu | ✅ | ❌ | ❌ | ❌ | ✅ | yulu:// |
| Porter | ❌ | ❌ | ❌ | ✅ | ❌ | porter:// |

## Sample Coordinates for Testing

```
Bangalore:
- Tech Park: 12.9716, 77.5946
- Brigade Gateway: 12.9279, 77.6276
- MG Road: 12.9789, 77.6064
- Indiranagar: 12.9716, 77.6412

Delhi:
- Connaught Place: 28.6328, 77.2197
- Karol Bagh: 28.6505, 77.1839

Mumbai:
- Bandra: 19.0596, 72.8295
- Worli: 19.0176, 72.8194
```

## Development Guides

### Adding a New Provider
1. Add to SQL seed data in `backend/database/schema.sql`
2. Add vehicle categories with rates
3. Rates auto-calculate in `faresController.js`

### Adding a New Ride Type
1. Insert into `ride_types` table
2. Add vehicle categories for each provider
3. Frontend automatically shows it in HomeScreen

### Customizing Fare Calculation
Edit `backend/services/fareService.js` - `calculateFares()` function

### Changing UI Styling
All screens use `StyleSheet`. Edit in each screen file.

## API Response Examples

### Fare Comparison Response
```json
{
  "success": true,
  "search_id": 42,
  "distance_km": 6.5,
  "duration_min": 15,
  "fares": [
    {
      "provider_id": 5,
      "provider_name": "Yulu",
      "vehicle_category_id": 8,
      "vehicle_name": "Yulu Bike",
      "ride_name": "Bike",
      "estimated_fare": 32.5,
      "estimated_time_min": 15,
      "base_fare": 10.0,
      "distance_km": 6.5,
      "duration_min": 15
    },
    {
      "provider_id": 4,
      "provider_name": "Rapido",
      "vehicle_category_id": 7,
      "vehicle_name": "Rapido Bike",
      "ride_name": "Bike",
      "estimated_fare": 35.65,
      "estimated_time_min": 15,
      "base_fare": 14.0,
      "distance_km": 6.5,
      "duration_min": 15
    }
  ]
}
```

### History Response
```json
[
  {
    "id": 1,
    "created_at": "2024-04-12T10:30:00Z",
    "distance_km": "6.50",
    "duration_min": 15,
    "ride_type": "Bike",
    "options_count": 6,
    "cheapest_fare": "32.50"
  }
]
```

## Final Checklist

- [x] Backend APIs implemented and tested
- [x] Frontend screens complete
- [x] Database schema and seed data
- [x] Authentication flow working
- [x] Fare calculation logic
- [x] Maps and geolocation
- [x] Search history
- [x] Deep linking to provider apps
- [x] Error handling
- [x] Environment configuration
- [x] Documentation complete

## Support & Contributions

For issues or improvements:
1. Check troubleshooting section above
2. Review API response logs
3. Check browser/app developer console
4. Create GitHub issue with error details

## License

MIT License - You're free to use, modify, and deploy this project.

## Changelog

### v1.0.0 (April 2024)
- Initial release
- 6 providers integrated
- Multi-ride type support
- Full authentication
- Search history
- Maps integration

---

**Ready to go live?** Check the deployment section and follow deployment guides!
