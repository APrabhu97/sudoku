# Firebase Setup Guide

## 📋 Prerequisites
- Google account
- Firebase CLI installed (optional but recommended)

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `sudoku-app` (or your preferred name)
   - Click "Continue"

3. **Configure Google Analytics** (Optional)
   - Enable/disable Google Analytics as needed
   - Click "Create project"
   - Wait for project creation to complete

## 🌍 Step 2: Set Region to US-East

1. **Open Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Set Default GCP Resource Location**
   - Scroll to "Default GCP resource location"
   - Select `us-east1` from dropdown
   - Click "Done"

## 🔥 Step 3: Enable Realtime Database

1. **Navigate to Realtime Database**
   - In left sidebar, click "Build" > "Realtime Database"
   - Click "Create Database"

2. **Choose Location**
   - Select `United States (us-central1)` or closest to us-east
   - Click "Next"

3. **Set Security Rules**
   - Choose "Start in **test mode**" for development
   - Click "Enable"
   - **IMPORTANT**: Update security rules before production!

## 🔑 Step 4: Get Firebase Configuration

1. **Add Web App**
   - In Project Overview, click "Add app" (</> icon)
   - Select "Web" platform
   - Register app with nickname: `sudoku-web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Configuration**
   - Copy the `firebaseConfig` object
   - You'll see something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

3. **Create .env File**
   ```bash
   cd /Users/hellydobariya/Desktop/projects/sudoko/sudoku-app
   cp .env.example .env
   ```

4. **Fill in .env File**
   - Open `.env` in your editor
   - Replace placeholder values with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## 🔒 Step 5: Set Up Security Rules

1. **Navigate to Rules Tab**
   - Go to Realtime Database > Rules tab

2. **Update Security Rules**
   ```json
   {
     "rules": {
       "users": {
         "$userId": {
           ".read": "$userId === auth.uid",
           ".write": "$userId === auth.uid"
         }
       },
       "games": {
         "$gameId": {
           ".read": "auth != null",
           ".write": "auth != null"
         }
       },
       "leaderboards": {
         ".read": true,
         ".write": false
       },
       "dailyChallenge": {
         ".read": true,
         ".write": false
       }
     }
   }
   ```

3. **Publish Rules**
   - Click "Publish"

## ✅ Step 6: Verify Setup

1. **Restart Development Server**
   ```bash
   npm start
   ```

2. **Check Console**
   - Look for "Firebase initialized successfully" message
   - No error messages about Firebase config

3. **Test Database Connection** (Optional)
   - Try writing test data in Firebase Console
   - Verify it appears in your app

## 📱 Step 7: Enable Authentication (For Later Phases)

1. **Navigate to Authentication**
   - Click "Build" > "Authentication"
   - Click "Get started"

2. **Enable Sign-in Methods**
   - Click "Sign-in method" tab
   - Enable "Anonymous" (for device-based auth simulation)
   - Add other providers as needed

## 🎯 Quick Test

Test your Firebase connection:

```typescript
import { initializeFirebase, isFirebaseConfigured } from '@/services/firebase';

// Check if configured
console.log('Firebase configured:', isFirebaseConfigured());

// Initialize
const { database, auth } = initializeFirebase();
console.log('Firebase initialized!');
```

## 🚨 Important Notes

### Security
- ⚠️ Never commit `.env` file to git (already in .gitignore)
- ⚠️ Update security rules before production launch
- ⚠️ Test mode rules allow anyone to read/write - update immediately!

### Environment Variables
- Expo uses `EXPO_PUBLIC_` prefix for client-side env vars
- Restart dev server after changing `.env` file
- For production, set env vars in EAS Build or hosting platform

### Database Structure
- See `/src/services/firebase/config.ts` for database paths
- Follow the structure defined in `DB_PATHS`
- Keep data normalized for better performance

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Rules](https://firebase.google.com/docs/database/security)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)

## 🐛 Troubleshooting

### "Firebase not configured" Error
- Check that `.env` file exists
- Verify all EXPO_PUBLIC_* variables are set
- Restart dev server with `npm start`

### Database Permission Denied
- Check security rules in Firebase Console
- Verify user is authenticated (for protected paths)
- Check that `auth != null` in rules

### Can't Connect to Database
- Verify `databaseURL` in config is correct
- Check internet connection
- Verify Firebase project has Realtime Database enabled

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Region set to us-east1
- [ ] Realtime Database enabled
- [ ] Web app registered
- [ ] Configuration copied
- [ ] `.env` file created and filled
- [ ] Security rules configured
- [ ] Firebase initialized in app
- [ ] Connection tested

**You're all set!** Firebase is ready for Phases 5+ (Multiplayer & Sync) 🎉
