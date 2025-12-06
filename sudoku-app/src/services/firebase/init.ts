import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp | null = null;
let database: Database | null = null;
let auth: Auth | null = null;

/**
 * Initializes Firebase app and services
 * Only initializes once even if called multiple times
 */
export function initializeFirebase(): {
  app: FirebaseApp;
  database: Database;
  auth: Auth;
} {
  // Check if Firebase is already initialized
  if (app && database && auth) {
    return { app, database, auth };
  }

  // Check if any Firebase apps exist
  const existingApps = getApps();
  
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    // Initialize new Firebase app
    app = initializeApp(firebaseConfig);
  }

  // Initialize services
  database = getDatabase(app);
  auth = getAuth(app);

  console.log('Firebase initialized successfully');

  return { app, database, auth };
}

/**
 * Gets the Firebase database instance
 * Initializes Firebase if not already done
 */
export function getFirebaseDatabase(): Database {
  if (!database) {
    const { database: db } = initializeFirebase();
    return db;
  }
  return database;
}

/**
 * Gets the Firebase auth instance
 * Initializes Firebase if not already done
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const { auth: a } = initializeFirebase();
    return a;
  }
  return auth;
}

/**
 * Checks if Firebase is properly configured
 * Returns true if all required config values are set
 */
export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId !== 'your-project-id' &&
    firebaseConfig.databaseURL !== 'https://your-project-default-rtdb.firebaseio.com'
  );
}
