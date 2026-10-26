import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Inicialización de la aplicación de Firebase (singleton seguro)
export const app: FirebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Instancia de Firestore configurada con la base de datos provisionada
export const databaseId: string = firebaseConfigData.firestoreDatabaseId || 'tienda1';
export const db: Firestore = getFirestore(app, databaseId);

// Instancia de Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// Exportación por defecto y alias para conveniencia en componentes
export default db;

