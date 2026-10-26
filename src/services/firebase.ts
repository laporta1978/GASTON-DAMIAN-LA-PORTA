import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore,
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { Product, Category, OrderDetails } from '../types';

// ============================================================================
// Firebase Initialization (Singleton with configured database 'tienda1')
// ============================================================================
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

export const app: FirebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

export const databaseId: string = firebaseConfigData.firestoreDatabaseId || 'tienda1';
export const db: Firestore = getFirestore(app, databaseId);

// ============================================================================
// Error Handling conforming to Firebase Skill Standard
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection validation
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify internet connection or project credentials.');
    }
    return false;
  }
}

// Trigger initial health check in background
testConnection();

// ============================================================================
// Helper Utilities for Safe Firestore Payloads
// ============================================================================
function isPlainObject(val: any): boolean {
  if (!val || typeof val !== 'object') return false;
  if (val.constructor && val.constructor.name === 'FieldValue') return false;
  if (typeof val._methodName === 'string') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}

function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => isPlainObject(item) ? cleanPayload(item) : item);
      } else if (isPlainObject(value)) {
        result[key] = cleanPayload(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// ============================================================================
// PRODUCTS SERVICE (tienda1 database)
// ============================================================================

/**
 * Fetches all products currently stored in Firestore.
 */
export async function fetchProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const productsCol = collection(db, path);
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Producto 3D',
        slug: data.slug || docSnap.id,
        category: data.category || 'jarras',
        categoryLabel: data.categoryLabel || 'Jarras',
        description: data.description || '',
        longDescription: data.longDescription || '',
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        isOffer: Boolean(data.isOffer),
        discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
        image: data.image || '',
        additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
        rating: Number(data.rating) || 5.0,
        reviewsCount: Number(data.reviewsCount) || 1,
        inStock: data.inStock !== false,
        stockCount: data.stockCount !== undefined ? Number(data.stockCount) : 10,
        printMaterial: data.printMaterial || 'PLA+',
        dimensions: data.dimensions || '10 x 10 x 10 cm',
        printTime: data.printTime || '3 hs',
        colors: Array.isArray(data.colors) ? data.colors : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        isFeatured: Boolean(data.isFeatured),
        onDemandOnly: Boolean(data.onDemandOnly)
      } as Product;
    });
  } catch (error) {
    console.warn('Error fetching products from Firestore:', error);
    return [];
  }
}

/**
 * Subscribes to real-time updates for products.
 */
export function subscribeToProducts(onUpdate: (products: Product[]) => void): () => void {
  const path = 'products';
  try {
    const productsCol = collection(db, path);
    const unsubscribe = onSnapshot(productsCol, (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const liveProducts: Product[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Producto 3D',
          slug: data.slug || docSnap.id,
          category: data.category || 'jarras',
          categoryLabel: data.categoryLabel || 'Jarras',
          description: data.description || '',
          longDescription: data.longDescription || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          isOffer: Boolean(data.isOffer),
          discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
          image: data.image || '',
          additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
          rating: Number(data.rating) || 5.0,
          reviewsCount: Number(data.reviewsCount) || 1,
          inStock: data.inStock !== false,
          stockCount: data.stockCount !== undefined ? Number(data.stockCount) : 10,
          printMaterial: data.printMaterial || 'PLA+',
          dimensions: data.dimensions || '10 x 10 x 10 cm',
          printTime: data.printTime || '3 hs',
          colors: Array.isArray(data.colors) ? data.colors : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          isFeatured: Boolean(data.isFeatured),
          onDemandOnly: Boolean(data.onDemandOnly)
        } as Product;
      });
      onUpdate(liveProducts);
    }, (error) => {
      console.warn('Products subscription error:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('Failed to attach products listener:', error);
    return () => {};
  }
}

/**
 * Saves or updates a product in Firestore.
 */
export async function saveProduct(product: Product): Promise<{ success: boolean; error?: string }> {
  const path = `products/${product.id}`;
  try {
    const productRef = doc(db, 'products', product.id);

    let finalImage = product.image || '';
    if (finalImage.startsWith('blob:')) {
      finalImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    }

    const finalAdditionalImages = (Array.isArray(product.additionalImages) ? product.additionalImages : [])
      .filter(img => typeof img === 'string' && !img.startsWith('blob:'));

    const cleaned = cleanPayload({
      id: product.id,
      name: product.name || 'Producto 3D',
      slug: product.slug || product.id,
      category: product.category || 'jarras',
      categoryLabel: product.categoryLabel || 'General',
      description: product.description || '',
      longDescription: product.longDescription || '',
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice !== undefined ? Number(product.originalPrice) : null,
      isOffer: Boolean(product.isOffer),
      discountPercent: product.discountPercent !== undefined ? Number(product.discountPercent) : null,
      image: finalImage,
      additionalImages: finalAdditionalImages,
      rating: Number(product.rating) || 5.0,
      reviewsCount: Number(product.reviewsCount) || 1,
      inStock: Boolean(product.inStock),
      onDemandOnly: Boolean(product.onDemandOnly),
      stockCount: product.stockCount !== undefined ? Number(product.stockCount) : 10,
      printMaterial: product.printMaterial || 'PLA+',
      dimensions: product.dimensions || '',
      printTime: product.printTime || '',
      colors: Array.isArray(product.colors) ? product.colors : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      isFeatured: Boolean(product.isFeatured),
      lastClientSync: new Date().toISOString()
    });

    cleaned.updatedAt = serverTimestamp();

    await setDoc(productRef, cleaned, { merge: true });
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error(`Error saving product ${product.id} to Firestore:`, error);
    return { success: false, error: msg };
  }
}

/**
 * Updates partial product fields.
 */
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const path = `products/${productId}`;
  try {
    const productRef = doc(db, 'products', productId);
    const safeUpdates = { ...updates };
    if (typeof safeUpdates.image === 'string' && safeUpdates.image.startsWith('blob:')) {
      delete safeUpdates.image;
    }
    if (Array.isArray(safeUpdates.additionalImages)) {
      safeUpdates.additionalImages = safeUpdates.additionalImages.filter(img => typeof img === 'string' && !img.startsWith('blob:'));
    }

    const cleaned = cleanPayload({
      ...safeUpdates,
      lastClientSync: new Date().toISOString()
    });
    cleaned.updatedAt = serverTimestamp();

    await setDoc(productRef, cleaned, { merge: true });
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error(`Error updating product ${productId} in Firestore:`, error);
    return { success: false, error: msg };
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  const path = `products/${productId}`;
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.warn(`Error deleting product ${productId} from Firestore:`, error);
    return false;
  }
}

/**
 * Bulk seeds products into Firestore.
 */
export async function seedProducts(productsToSeed: Product[]): Promise<number> {
  let count = 0;
  try {
    const chunkSize = 5;
    for (let i = 0; i < productsToSeed.length; i += chunkSize) {
      const chunk = productsToSeed.slice(i, i + chunkSize);
      const results = await Promise.all(chunk.map(p => saveProduct(p)));
      count += results.filter(r => r.success).length;
    }
    return count;
  } catch (error) {
    console.warn('Error during bulk product seeding:', error);
    return count;
  }
}

// ============================================================================
// CATEGORIES SERVICE (tienda1 database)
// ============================================================================

/**
 * Fetches all categories from Firestore.
 */
export async function fetchCategories(): Promise<Category[]> {
  const path = 'categories';
  try {
    const catCol = collection(db, path);
    const snapshot = await getDocs(catCol);
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || docSnap.id,
        description: data.description || '',
        image: data.image || '',
        count: Number(data.count) || 0,
        iconName: data.iconName || 'Sparkles'
      } as Category;
    });
  } catch (error) {
    console.warn('Error fetching categories from Firestore:', error);
    return [];
  }
}

/**
 * Subscribes to real-time updates for categories.
 */
export function subscribeToCategories(onUpdate: (categories: Category[]) => void): () => void {
  const path = 'categories';
  try {
    const catCol = collection(db, path);
    const unsubscribe = onSnapshot(catCol, (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const liveCats: Category[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || docSnap.id,
          description: data.description || '',
          image: data.image || '',
          count: Number(data.count) || 0,
          iconName: data.iconName || 'Sparkles'
        } as Category;
      });
      onUpdate(liveCats);
    }, (error) => {
      console.warn('Categories subscription error:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('Failed to attach categories listener:', error);
    return () => {};
  }
}

/**
 * Saves or updates a category in Firestore.
 */
export async function saveCategory(category: Category): Promise<boolean> {
  const path = `categories/${category.id}`;
  try {
    const catRef = doc(db, 'categories', category.id);
    await setDoc(catRef, {
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      count: category.count || 0,
      iconName: category.iconName || 'Sparkles',
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`Error saving category ${category.id} to Firestore:`, error);
    return false;
  }
}

/**
 * Deletes a category from Firestore.
 */
export async function deleteCategory(categoryId: string): Promise<boolean> {
  const path = `categories/${categoryId}`;
  try {
    const catRef = doc(db, 'categories', categoryId);
    await deleteDoc(catRef);
    return true;
  } catch (error) {
    console.warn(`Error deleting category ${categoryId} from Firestore:`, error);
    return false;
  }
}

/**
 * Bulk seeds categories into Firestore.
 */
export async function seedCategories(categoriesToSeed: Category[]): Promise<number> {
  let count = 0;
  try {
    for (const cat of categoriesToSeed) {
      const ok = await saveCategory(cat);
      if (ok) count++;
    }
    return count;
  } catch (error) {
    console.warn('Error seeding categories to Firestore:', error);
    return count;
  }
}

export default {
  db,
  app,
  databaseId,
  fetchProducts,
  subscribeToProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  fetchCategories,
  subscribeToCategories,
  saveCategory,
  deleteCategory,
  seedCategories
};
