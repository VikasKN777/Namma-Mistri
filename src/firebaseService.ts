/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Site, Laborer, AttendanceLog, SitePhoto, MaterialRates } from './types';

// Connection test as required by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export const firebaseService = {
  // Sites
  async getSites() {
    const q = query(collection(db, 'sites'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Site));
  },

  async addSite(site: Omit<Site, 'id'>) {
    return await addDoc(collection(db, 'sites'), site);
  },

  // Laborers
  async getLaborers() {
    const q = query(collection(db, 'laborers'), where('active', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Laborer));
  },

  async addLaborer(laborer: Omit<Laborer, 'id'>) {
    return await addDoc(collection(db, 'laborers'), laborer);
  },

  // Logs
  async addLog(log: Omit<AttendanceLog, 'id'>) {
    return await addDoc(collection(db, 'logs'), log);
  },

  async getLogsBySite(siteId: string) {
    const q = query(collection(db, 'logs'), where('siteId', '==', siteId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceLog));
  },

  // Photos
  async addPhoto(photo: Omit<SitePhoto, 'id'>) {
    return await addDoc(collection(db, 'photos'), photo);
  },

  async getPhotos(siteId: string) {
    const q = query(collection(db, 'photos'), where('siteId', '==', siteId), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SitePhoto));
  }
};
