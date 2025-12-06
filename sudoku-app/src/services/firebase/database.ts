/**
 * Firebase Database Service
 * Provides helper functions for common database operations
 */

import { ref, set, get, update, remove, onValue, off, push } from 'firebase/database';
import { getFirebaseDatabase } from './init';
import type { Database, DatabaseReference } from 'firebase/database';

/**
 * Gets a reference to a database path
 */
export function getDbRef(path: string): DatabaseReference {
  const db = getFirebaseDatabase();
  return ref(db, path);
}

/**
 * Writes data to a database path
 */
export async function writeData(path: string, data: unknown): Promise<void> {
  const dbRef = getDbRef(path);
  await set(dbRef, data);
}

/**
 * Reads data from a database path
 */
export async function readData<T>(path: string): Promise<T | null> {
  const dbRef = getDbRef(path);
  const snapshot = await get(dbRef);
  return snapshot.exists() ? (snapshot.val() as T) : null;
}

/**
 * Updates specific fields at a database path
 */
export async function updateData(path: string, updates: Record<string, unknown>): Promise<void> {
  const dbRef = getDbRef(path);
  await update(dbRef, updates);
}

/**
 * Deletes data at a database path
 */
export async function deleteData(path: string): Promise<void> {
  const dbRef = getDbRef(path);
  await remove(dbRef);
}

/**
 * Pushes new data to a list (generates unique key)
 */
export async function pushData(path: string, data: unknown): Promise<string> {
  const dbRef = getDbRef(path);
  const newRef = push(dbRef);
  await set(newRef, data);
  return newRef.key!;
}

/**
 * Subscribes to real-time updates at a path
 * Returns unsubscribe function
 */
export function subscribeToData<T>(
  path: string,
  callback: (data: T | null) => void
): () => void {
  const dbRef = getDbRef(path);
  
  const listener = onValue(dbRef, (snapshot) => {
    const data = snapshot.exists() ? (snapshot.val() as T) : null;
    callback(data);
  });

  // Return unsubscribe function
  return () => {
    off(dbRef, 'value', listener);
  };
}

/**
 * Subscribes to real-time updates with error handling
 */
export function subscribeWithErrorHandling<T>(
  path: string,
  onData: (data: T | null) => void,
  onError: (error: Error) => void
): () => void {
  const dbRef = getDbRef(path);
  
  const listener = onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.exists() ? (snapshot.val() as T) : null;
      onData(data);
    },
    (error) => {
      onError(error as Error);
    }
  );

  return () => {
    off(dbRef, 'value', listener);
  };
}
