/**
 * Firebase Configuration
 * 
 * To set up Firebase for your project:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (select us-east1 as region)
 * 3. Add a web app to your project
 * 4. Copy the config object and replace the placeholder values below
 * 5. Enable Realtime Database in the Firebase Console
 * 6. Set up database security rules
 * 
 * IMPORTANT: Never commit actual Firebase credentials to version control.
 * Use environment variables or a .env file for production.
 */

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://your-project-default-rtdb.firebaseio.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Database paths for easy reference
export const DB_PATHS = {
  users: (userId: string) => `users/${userId}`,
  games: (gameId: string) => `games/${gameId}`,
  gameResults: (resultId: string) => `gameResults/${resultId}`,
  leaderboards: (period: string, type: string) => `leaderboards/${period}/${type}`,
  dailyChallenge: (date: string) => `dailyChallenge/${date}`,
  matchmakingQueue: 'matchmakingQueue',
  friendRequests: (userId: string) => `friendRequests/${userId}`,
};
