/**
 * Firebase Service - Main Export
 * 
 * Provides a centralized interface for all Firebase operations
 */

// Configuration
export { firebaseConfig, DB_PATHS } from './config';

// Initialization
export {
  initializeFirebase,
  getFirebaseDatabase,
  getFirebaseAuth,
  isFirebaseConfigured,
} from './init';

// Database operations
export {
  getDbRef,
  writeData,
  readData,
  updateData,
  deleteData,
  pushData,
  subscribeToData,
  subscribeWithErrorHandling,
} from './database';

// Re-export Firebase types for convenience
export type { FirebaseApp } from 'firebase/app';
export type { Database, DatabaseReference } from 'firebase/database';
export type { Auth, User } from 'firebase/auth';
