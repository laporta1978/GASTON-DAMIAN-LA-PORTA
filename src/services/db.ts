import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { OrderDetails, Product, Category } from '../types';
import { Testimonial } from '../data/testimonials';

// Types for additional Firestore entities
export interface CustomQuoteData {
  clientName: string;
  projectName: string;
  material: string;
  color?: string;
  quantity: number;
  dimensions?: string;
  notes?: string;
  fileName?: string;
  createdAt?: any;
}

export interface ContactMessageData {
  name: string;
  email: string;
  message: string;
  createdAt?: any;
}

export interface SubscriberData {
  email: string;
  createdAt?: any;
}

/**
 * Saves a completed order into the Firestore 'orders' collection.
 */
export async function saveOrderToFirestore(order: OrderDetails): Promise<string | null> {
  try {
    const ordersCol = collection(db, 'orders');
    const orderDoc = {
      orderNumber: order.orderNumber,
      customer: {
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email,
        dni: order.customer.dni,
        deliveryMethod: order.customer.deliveryMethod,
        street: order.customer.street || '',
        number: order.customer.number || '',
        floorApt: order.customer.floorApt || '',
        neighborhood: order.customer.neighborhood || '',
        city: order.customer.city || '',
        postalCode: order.customer.postalCode || '',
        orderNotes: order.customer.orderNotes || '',
      },
      items: order.items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor?.name || 'Estándar',
        colorHex: item.selectedColor?.hex || '#EA580C',
        customNotes: item.customNotes || '',
        category: item.product.category,
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      shippingCost: order.shippingCost,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status || 'en_produccion',
      createdAt: serverTimestamp(),
      clientTimestamp: order.date || new Date().toISOString(),
    };

    const docRef = await addDoc(ordersCol, orderDoc);
    return docRef.id;
  } catch (error) {
    console.warn('Could not save order to Firestore (offline or rules fallback):', error);
    return null;
  }
}

/**
 * Searches for an order by its orderNumber (e.g., "#TH-123456" or "TH-123456").
 */
export async function fetchOrderByNumber(orderNumber: string): Promise<any | null> {
  try {
    const cleanNumber = orderNumber.trim().toUpperCase();
    const formattedNumber = cleanNumber.startsWith('#') ? cleanNumber : `#${cleanNumber}`;
    
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('orderNumber', '==', formattedNumber), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...docData };
    }

    // Try without hash just in case
    const q2 = query(ordersCol, where('orderNumber', '==', cleanNumber), limit(1));
    const snapshot2 = await getDocs(q2);
    if (!snapshot2.empty) {
      const docData = snapshot2.docs[0].data();
      return { id: snapshot2.docs[0].id, ...docData };
    }

    return null;
  } catch (error) {
    console.warn('Error fetching order from Firestore:', error);
    return null;
  }
}

/**
 * Saves a custom 3D printing quotation request to 'custom_quotes'.
 */
export async function saveCustomQuoteToFirestore(quote: CustomQuoteData): Promise<string | null> {
  try {
    const quotesCol = collection(db, 'custom_quotes');
    const docRef = await addDoc(quotesCol, {
      ...quote,
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save custom quote to Firestore:', error);
    return null;
  }
}

/**
 * Saves a contact form message to 'contact_messages'.
 */
export async function saveContactMessageToFirestore(contact: ContactMessageData): Promise<string | null> {
  try {
    const messagesCol = collection(db, 'contact_messages');
    const docRef = await addDoc(messagesCol, {
      ...contact,
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save contact message to Firestore:', error);
    return null;
  }
}

/**
 * Saves a user review to the 'reviews' collection.
 */
export async function saveReviewToFirestore(review: Omit<Testimonial, 'id'>): Promise<string | null> {
  try {
    const reviewsCol = collection(db, 'reviews');
    const docRef = await addDoc(reviewsCol, {
      ...review,
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save review to Firestore:', error);
    return null;
  }
}

/**
 * Real-time listener for user reviews from Firestore.
 */
export function subscribeToReviews(onUpdate: (reviews: Testimonial[]) => void): () => void {
  try {
    const reviewsCol = collection(db, 'reviews');
    const q = query(reviewsCol, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveReviews: Testimonial[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Cliente Verificado',
          role: data.role || 'Cliente Verificado',
          city: data.city || 'Buenos Aires',
          avatar: '',
          rating: Number(data.rating) || 5,
          comment: data.comment || '',
          purchasedProduct: data.purchasedProduct || 'Pieza 3D Personalizada',
          productImage: data.productImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          highlightTag: data.highlightTag || 'Reseña de la Comunidad',
          date: data.date || 'Recién publicado',
          verifiedPurchase: data.verifiedPurchase !== false,
          featured: Boolean(data.featured)
        };
      });
      onUpdate(liveReviews);
    }, (error) => {
      console.warn('Reviews subscription error (using local reviews):', error);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('Failed to attach review listener:', error);
    return () => {};
  }
}

/**
 * Saves a newsletter subscriber to 'subscribers'.
 */
export async function saveSubscriberToFirestore(email: string): Promise<boolean> {
  try {
    const subscribersCol = collection(db, 'subscribers');
    await addDoc(subscribersCol, {
      email: email.trim().toLowerCase(),
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn('Could not save subscriber to Firestore:', error);
    return false;
  }
}

/**
 * =========================================================================
 * PRODUCTS CRUD & REAL-TIME FIRESTORE SYNC (Database: tienda1)
 * =========================================================================
 */

/**
 * Helper to identify pure JSON dictionary objects, ensuring Firebase FieldValue
 * (like serverTimestamp()) or special prototypes are NEVER stripped or mutated.
 */
function isPlainObject(val: any): boolean {
  if (!val || typeof val !== 'object') return false;
  if (val.constructor && val.constructor.name === 'FieldValue') return false;
  if (typeof val._methodName === 'string') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}

/**
 * Helper to strip undefined values so Firestore never throws 'unsupported field value undefined' errors
 */
function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => isPlainObject(item) ? cleanFirestoreData(item) : item);
      } else if (isPlainObject(value)) {
        result[key] = cleanFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Saves or replaces a product in the 'products' collection in Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const rawId = (product.id || '').trim();
    if (!rawId) {
      throw new Error('El ID del producto no puede estar vacío.');
    }

    // Clean document path ID
    const cleanDocId = rawId
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'producto-3d';

    const productRef = doc(db, 'products', cleanDocId);

    // Safeguard: Never store volatile browser memory blob: URLs
    let finalImage = product.image || '';
    if (finalImage.startsWith('blob:')) {
      console.warn(`Product ${cleanDocId} image has temporary blob URL, replacing with fallback`);
      finalImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    }

    const finalAdditionalImages = (Array.isArray(product.additionalImages) ? product.additionalImages : [])
      .filter(img => typeof img === 'string' && !img.startsWith('blob:'));

    const cleaned = cleanFirestoreData({
      id: cleanDocId,
      name: product.name?.trim() || 'Producto 3D',
      slug: product.slug || cleanDocId,
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

    // Directly assign serverTimestamp so cleanFirestoreData never mutates the FieldValue instance
    cleaned.updatedAt = serverTimestamp();

    await setDoc(productRef, cleaned, { merge: true });
    console.log(`[Firestore tienda1] Documento guardado exitosamente: "products/${cleanDocId}" ("${product.name}")`);
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error(`[Firestore tienda1] Error guardando producto "${product?.name}":`, error);
    return { success: false, error: msg };
  }
}

/**
 * Updates specific fields of a product in Firestore.
 */
export async function updateProductInFirestore(productId: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    const productRef = doc(db, 'products', productId);
    
    const safeUpdates = { ...updates };
    if (typeof safeUpdates.image === 'string' && safeUpdates.image.startsWith('blob:')) {
      delete safeUpdates.image;
    }
    if (Array.isArray(safeUpdates.additionalImages)) {
      safeUpdates.additionalImages = safeUpdates.additionalImages.filter(img => typeof img === 'string' && !img.startsWith('blob:'));
    }

    const cleaned = cleanFirestoreData({
      ...safeUpdates,
      lastClientSync: new Date().toISOString()
    });

    cleaned.updatedAt = serverTimestamp();

    await setDoc(productRef, cleaned, { merge: true });
    console.log(`Product ${productId} updated in Firestore tienda1`);
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error(`Error updating product ${productId} in Firestore tienda1:`, error);
    return { success: false, error: msg };
  }
}

/**
 * Deletes a product document from Firestore.
 */
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    console.log(`Product ${productId} deleted from Firestore tienda1`);
    return true;
  } catch (error) {
    console.warn(`Error deleting product ${productId} from Firestore:`, error);
    return false;
  }
}

/**
 * Deletes all products matching a specific name or pattern from Firestore tienda1.
 */
export async function deleteProductsByNameFromFirestore(nameQuery: string): Promise<{ deletedCount: number; deletedIds: string[] }> {
  const deletedIds: string[] = [];
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const qLower = nameQuery.toLowerCase().trim();
    const qSlug = qLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const name = (data.name || '').toLowerCase();
      const id = docSnap.id.toLowerCase();
      const slug = (data.slug || '').toLowerCase();

      if (
        name.includes(qLower) || 
        id.includes(qSlug) || 
        slug.includes(qSlug) ||
        (qLower.includes('river') && (name.includes('river') || id.includes('river')))
      ) {
        await deleteDoc(doc(db, 'products', docSnap.id));
        deletedIds.push(docSnap.id);
      }
    }
    console.log(`Bulk deleted ${deletedIds.length} matching "${nameQuery}" from Firestore tienda1`);
    return { deletedCount: deletedIds.length, deletedIds };
  } catch (error) {
    console.warn(`Error deleting products matching "${nameQuery}":`, error);
    return { deletedCount: deletedIds.length, deletedIds };
  }
}

/**
 * Fetches all products currently stored in Firestore.
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
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
        isFeatured: Boolean(data.isFeatured)
      } as Product;
    });
  } catch (error) {
    console.warn('Error fetching products from Firestore:', error);
    return [];
  }
}

/**
 * Subscribes to real-time updates of the 'products' collection in Firestore.
 */
export function subscribeToProducts(onUpdate: (products: Product[]) => void): () => void {
  try {
    const productsCol = collection(db, 'products');
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
          isFeatured: Boolean(data.isFeatured)
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
 * Bulk seeds products into Firestore with parallel batching for high speed.
 */
export async function seedProductsToFirestore(productsToSeed: Product[]): Promise<number> {
  let count = 0;
  try {
    const chunkSize = 5;
    for (let i = 0; i < productsToSeed.length; i += chunkSize) {
      const chunk = productsToSeed.slice(i, i + chunkSize);
      const results = await Promise.all(chunk.map(p => saveProductToFirestore(p)));
      count += results.filter(r => r.success).length;
    }
    console.log(`Successfully seeded ${count}/${productsToSeed.length} products to Firestore tienda1`);
    return count;
  } catch (error) {
    console.warn('Error during bulk product seeding:', error);
    return count;
  }
}

/**
 * Diagnostic test to verify live connection to Firestore database 'tienda1'.
 */
export async function testFirestoreConnection(): Promise<{ 
  success: boolean; 
  productsCount: number; 
  categoriesCount: number; 
  databaseId: string; 
  error?: string 
}> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    return {
      success: true,
      productsCount: productsSnap.size,
      categoriesCount: categoriesSnap.size,
      databaseId: 'tienda1'
    };
  } catch (err: any) {
    return {
      success: false,
      productsCount: 0,
      categoriesCount: 0,
      databaseId: 'tienda1',
      error: err?.message || String(err)
    };
  }
}

/**
 * Saves or updates a Category in Firestore 'categories' collection.
 */
export async function saveCategoryToFirestore(cat: Category): Promise<boolean> {
  try {
    const catRef = doc(db, 'categories', cat.id);
    await setDoc(catRef, {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      count: cat.count || 0,
      iconName: cat.iconName || 'Sparkles',
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`Error saving category ${cat.id} to Firestore:`, error);
    return false;
  }
}

/**
 * Subscribes to real-time updates of the 'categories' collection in Firestore.
 */
export function subscribeToCategories(onUpdate: (categories: Category[]) => void): () => void {
  try {
    const catCol = collection(db, 'categories');
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
 * Deletes a Category from Firestore 'categories' collection.
 */
export async function deleteCategoryFromFirestore(categoryId: string): Promise<boolean> {
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
 * Seeds initial categories into Firestore.
 */
export async function seedCategoriesToFirestore(categoriesToSeed: Category[]): Promise<number> {
  let count = 0;
  try {
    for (const cat of categoriesToSeed) {
      const ok = await saveCategoryToFirestore(cat);
      if (ok) count++;
    }
    console.log(`Successfully seeded ${count} categories to Firestore tienda1`);
    return count;
  } catch (error) {
    console.warn('Error seeding categories to Firestore:', error);
    return count;
  }
}


