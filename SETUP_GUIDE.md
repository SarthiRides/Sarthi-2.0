# 🚀 Quick Setup Guide - Ride Fare Comparator

## 5-Minute Quick Start

### Prerequisites
- MySQL is running
- Node.js 18+ installed
- **Expo CLI installed** (optional but recommended): `npm install -g @expo/cli`
- **Expo Go app** on your phone (any version - fully compatible!)
- Google Maps API key (optional for real distance calculations)

### Android Development Setup (Optional)

If you want to use Expo and run on a physical device, Android Studio is not required.

**1. Install Expo CLI (recommended)**
```powershell
npm install -g @expo/cli
```

**2. Install Expo Go**
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

**3. Optional: Android Studio for local emulator**
- Download from: https://developer.android.com/studio
- Install with default settings
- Launch Android Studio and complete setup wizard
```powershell
# Set JAVA_HOME (adjust path to your JDK installation)
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'Machine')

# Add to PATH
$env:Path += ";$env:JAVA_HOME\bin"
$env:Path += ";C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools"
$env:Path += ";C:\Users\%USERNAME%\AppData\Local\Android\Sdk\tools"
$env:Path += ";C:\Users\%USERNAME%\AppData\Local\Android\Sdk\tools\bin"

# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\%USERNAME%\AppData\Local\Android\Sdk', 'Machine')
```

**3. Create Android Virtual Device**
- Open Android Studio
- Tools → Device Manager
- Create new device (Pixel 4 recommended)
- Download system image (API 33 recommended)

### Step 1: Database (1 min)
```bash
mysql -u root -p < backend/database/schema.sql
```

### Step 2: Backend (2 min)
```bash
cd backend
npm install  # Already done, just in case
npm run dev
# Should see: 🚀 Server running on port 3001
```

### Step 3: Frontend (2 min)
```bash
cd frontend
npm install  # Installs Expo and all dependencies
npx expo install react-native-vector-icons react-native-maps @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens react-native-gesture-handler expo-location
npx expo start
```

### Step 4: Run the App
```bash
# Using Expo Go on a device or emulator (RECOMMENDED)
cd frontend
npx expo start

# Scan QR code with:
# - Expo Go app (iOS/Android) - WORKS WITH ALL VERSIONS!
# - Camera app (iOS)
# - Built-in scanner (Android)
```

If you prefer the native Android build instead, use:
```bash
cd frontend
npx react-native run-android
```

## Test Credentials
- **Email**: test@example.com
- **Password**: password123

## Next Steps

1. **Test API** (without frontend):
   - Open Postman/Insomnia
   - POST http://localhost:3001/api/auth/login
   - Body: `{"email": "test@example.com", "password": "password123"}`
   - Copy token and test other endpoints

2. **View Full Documentation**: See `README_COMPLETE.md` for comprehensive guide

3. **Troubleshoot**: Check the Troubleshooting section in README_COMPLETE.md

## Common Issues

| Issue | Fix |
|-------|-----|
| MySQL not running | `mysql.server start` (Mac) or `sudo systemctl start mysql` (Linux) |
| Port 3001 in use | `lsof -ti:3001 \| xargs kill -9` |
| Metro bundler crash | `npm start -- --reset-cache` |
| Location permission denied | Grant permission when prompted |
| Maps not showing | Add Google API key to AndroidManifest.xml |
| **JAVA_HOME not set** | Install JDK 17+ and set environment variable |
| **ADB not found** | Install Android Studio and add to PATH |
| **No emulators** | Create AVD in Android Studio Device Manager |

## Project Structure

```
backend/          ← API server (port 3001)
frontend/         ← React Native app
README_COMPLETE.md ← Full documentation
TODO.md           ← Project progress
```

## What's Included

✅ **Backend**
- Express.js API with JWT auth
- MySQL database with seed data
- 6 ride providers (Ola, Uber, Yatri, Rapido, Yulu, Porter)
- Fare comparison logic
- Search history tracking

✅ **Frontend**
- Login/Register screens
- Home screen with maps
- Real-time fare comparison results
- Search history
- Deep linking to provider apps

✅ **Database**
- User authentication
- Provider & ride type data
- Dynamic pricing per provider
- Search history storage

## Environment Variables

**Backend (.env)** - Already configured:
- PORT: 3001
- DB connection to ride_fare_comparator
- JWT_SECRET: pre-filled
- GOOGLE_API_KEY: needs your key for real API

**Frontend (api.js)** - Already configured:
- Android Emulator: http://10.0.2.2:3001/api
- iOS Simulator: http://localhost:3001/api
- **Physical Device**: Update `http://192.168.1.100:3001/api` in `src/services/api.js` to your computer's IP address

To find your IP address:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig | grep inet
```

## Ready to Deploy?

See README_COMPLETE.md "Deployment" section for:
- Backend deployment (Railway, Heroku, AWS)
- Frontend deployment (EAS Build, App Stores)
- Production configuration

---

**That's it! Your full-stack app is ready to use.** 🎉

For detailed docs, troubleshooting, and deployment → See `README_COMPLETE.md`
