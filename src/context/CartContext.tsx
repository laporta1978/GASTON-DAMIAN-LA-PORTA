import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartItem, Toast, CustomerInfo, OrderDetails } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '../data/products';
import { 
  saveOrderToFirestore, 
  saveProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  deleteProductsByNameFromFirestore,
  subscribeToProducts, 
  seedProductsToFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  subscribeToCategories,
  seedCategoriesToFirestore
} from '../services/db';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; hex: string }, notes?: string) => void;
  removeFromCart: (productId: string, colorName?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorName?: string) => void;
  clearCart: () => void;
  restoreCart: (items: CartItem[]) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingCost: number;
  selectedShipping: 'caba_express' | 'correo_argentino' | 'retiro_taller';
  setSelectedShipping: (method: 'caba_express' | 'correo_argentino' | 'retiro_taller') => void;
  total: number;
  
  // Products & Stock Management
  products: Product[];
  addProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => void;
  deleteProductsByName: (term: string) => Promise<number>;
  updateStock: (productId: string, inStock: boolean, stockCount?: number) => void;
  resetProductsToDefault: () => void;
  syncAllProductsToFirestore: () => Promise<number>;
  disableAllFeatured: () => Promise<void>;
  toggleFeatured: (productId: string) => void;

  // Categories & Cover Photos Management
  categories: Category[];
  addCategory: (categoryData: Partial<Category>) => Category;
  updateCategory: (categoryId: string, updatedFields: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  resetCategoriesToDefault: () => void;
  syncAllCategoriesToFirestore: () => Promise<number>;
  
  // Stock Control vs. On-Demand WhatsApp Mode
  isStockDisabled: boolean;
  setIsStockDisabled: (disabled: boolean) => void;
  whatsappNumber: string;
  setWhatsappNumber: (phone: string) => void;
  setAllProductsOnDemand: () => Promise<void>;
  restoreDefaultStockLimits: () => Promise<void>;

  // Admin UI states
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminEditProduct: Product | null;
  setAdminEditProduct: (product: Product | null) => void;

  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCustomModalOpen: boolean;
  setIsCustomModalOpen: (open: boolean) => void;
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Navigation / Views
  currentView: 'shop' | 'checkout' | 'order-success';
  setCurrentView: (view: 'shop' | 'checkout' | 'order-success') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Order
  lastOrder: OrderDetails | null;
  placeOrder: (customer: CustomerInfo) => OrderDetails;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'thunder3d_cart_v1';
const FAVS_STORAGE_KEY = 'thunder3d_favs_v2';
const PRODUCTS_STORAGE_KEY = 'thunder3d_products_catalog_v6';
const CATEGORIES_STORAGE_KEY = 'thunder3d_categories_catalog_v2';
const DELETED_CATEGORIES_KEY = 'thunder3d_deleted_categories_v1';
const DELETED_PRODUCTS_KEY = 'thunder3d_deleted_products_v1';
const STOCK_DISABLED_KEY = 'thunder3d_stock_disabled_mode_v2';
const WHATSAPP_PHONE_KEY = 'thunder3d_whatsapp_phone_v2';

const getDeletedProductIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return new Set(list);
    }
  } catch (e) {
    console.error(e);
  }
  return new Set();
};

const getDeletedCategoryIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_CATEGORIES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return new Set(list);
    }
  } catch (e) {
    console.error(e);
  }
  return new Set();
};

export const generateCleanProductId = (name: string, existingIds?: string[]): string => {
  const base = (name || 'producto-3d')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'producto-3d';

  if (!existingIds || existingIds.length === 0) return base;
  if (!existingIds.includes(base)) return base;

  let counter = 2;
  while (existingIds.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stock disabled mode (true = On-demand WhatsApp orders without inventory blocking)
  const [isStockDisabled, setIsStockDisabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STOCK_DISABLED_KEY);
      return saved !== null ? JSON.parse(saved) : true; // Default to true as requested
    } catch {
      return true;
    }
  });

  const setIsStockDisabled = (disabled: boolean) => {
    setIsStockDisabledState(disabled);
    try {
      localStorage.setItem(STOCK_DISABLED_KEY, JSON.stringify(disabled));
    } catch (e) {
      console.error(e);
    }
    addToast(
      disabled 
        ? '⚡ Modo Pedidos por WhatsApp activado: Stock desactivado (Fabricación a Demanda)' 
        : '📦 Control de Stock tradicional activado',
      'info'
    );
  };

  // WhatsApp Phone Number for orders
  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(WHATSAPP_PHONE_KEY);
      return saved || '5491123456789';
    } catch {
      return '5491123456789';
    }
  });

  const setWhatsappNumber = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    setWhatsappNumberState(clean || '5491123456789');
    try {
      localStorage.setItem(WHATSAPP_PHONE_KEY, clean || '5491123456789');
    } catch (e) {
      console.error(e);
    }
    addToast('Número de WhatsApp de pedidos actualizado', 'success');
  };

  // Categories state loaded from localStorage or initialized from INITIAL_CATEGORIES
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const deletedIds = getDeletedCategoryIds();
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: any) => !deletedIds.has(c.id));
        }
      }
      return INITIAL_CATEGORIES.filter(c => !deletedIds.has(c.id));
    } catch (e) {
      console.error('Error loading categories from storage:', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Products state loaded from localStorage or initialized from INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const deletedIds = getDeletedProductIds();
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY) || localStorage.getItem('thunder3d_products_catalog_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filteredSaved = parsed.filter((p: any) => {
            if (!p || !p.id) return false;
            return !deletedIds.has(p.id);
          });
          const existingIds = new Set(filteredSaved.map((p: any) => p.id));
          const missingDefaults = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id) && !deletedIds.has(p.id)).map(p => ({
            ...p,
            stockCount: p.stockCount ?? (p.inStock ? 15 : 0)
          }));
          return [...filteredSaved, ...missingDefaults];
        }
      }
      return INITIAL_PRODUCTS.filter(p => !deletedIds.has(p.id)).map(p => ({
        ...p,
        stockCount: p.stockCount ?? (p.inStock ? 15 : 0)
      }));
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
    return INITIAL_PRODUCTS.map(p => ({
      ...p,
      stockCount: p.stockCount ?? (p.inStock ? 15 : 0)
    }));
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<'caba_express' | 'correo_argentino' | 'retiro_taller'>('caba_express');
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminEditProduct, setAdminEditProduct] = useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentView, setCurrentView] = useState<'shop' | 'checkout' | 'order-success'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('jarras');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Real-time synchronization with Firestore (collection: 'products' in database 'tienda1')
  useEffect(() => {
    let isMounted = true;
    let hasAttemptedInitialSeed = false;

    const unsubscribe = subscribeToProducts((firestoreProducts) => {
      if (!isMounted) return;
      if (firestoreProducts && firestoreProducts.length > 0) {
        const deletedIds = getDeletedProductIds();
        const validLive = firestoreProducts.filter(p => {
          if (!p || !p.id || !p.name) return false;
          return !deletedIds.has(p.id);
        });
        
        if (validLive.length > 0) {
          // Automatic migration of legacy prod-179... IDs to human-readable names
          const migratedLive: Product[] = [];
          for (const item of validLive) {
            if (item.id.startsWith('prod-')) {
              const cleanId = generateCleanProductId(item.name || item.slug || 'producto-3d', validLive.map(p => p.id));
              const upgradedItem: Product = { ...item, id: cleanId, slug: cleanId };
              saveProductToFirestore(upgradedItem).then(() => {
                deleteProductFromFirestore(item.id);
                console.log(`Migrated Firestore product ID from ${item.id} to readable name: ${cleanId}`);
              }).catch(e => console.warn(e));
              migratedLive.push(upgradedItem);
            } else {
              migratedLive.push(item);
            }
          }

          setProducts(prev => {
            // Merge migratedLive with any non-conflicting items
            const liveMap = new Map(migratedLive.map(p => [p.id, p]));
            // Keep local items if they are not yet in Firestore or if they are in liveMap
            const merged = [...migratedLive];
            for (const localP of prev) {
              if (!liveMap.has(localP.id) && !deletedIds.has(localP.id)) {
                merged.push(localP);
              }
            }
            return merged;
          });

          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(migratedLive));
          } catch (e) {
            console.error(e);
          }
        }
      } else if (!hasAttemptedInitialSeed && firestoreProducts && firestoreProducts.length === 0) {
        // If Firestore 'products' collection is completely empty in tienda1, auto-seed the default catalog
        hasAttemptedInitialSeed = true;
        const initialToSeed = INITIAL_PRODUCTS.map(p => ({
          ...p,
          stockCount: p.stockCount ?? (p.inStock ? 15 : 0)
        }));
        seedProductsToFirestore(initialToSeed).then((count) => {
          console.log(`Auto-seeded ${count} products to empty Firestore tienda1 collection.`);
        }).catch(err => {
          console.warn('Initial seeding notice:', err);
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization for categories with Firestore ('categories' collection in tienda1)
  useEffect(() => {
    let isMounted = true;
    let hasAttemptedInitialSeed = false;

    const unsubscribe = subscribeToCategories((firestoreCategories) => {
      if (!isMounted) return;
      const deletedIds = getDeletedCategoryIds();
      if (firestoreCategories && firestoreCategories.length > 0) {
        const filtered = firestoreCategories.filter(c => !deletedIds.has(c.id));
        setCategories(filtered);
        try {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
        } catch (e) {
          console.error(e);
        }
      } else if (!hasAttemptedInitialSeed && firestoreCategories && firestoreCategories.length === 0) {
        hasAttemptedInitialSeed = true;
        const toSeed = INITIAL_CATEGORIES.filter(c => !deletedIds.has(c.id));
        if (toSeed.length > 0) {
          seedCategoriesToFirestore(toSeed).then((count) => {
            console.log(`Auto-seeded ${count} categories to Firestore tienda1.`);
          }).catch(err => {
            console.warn('Categories initial seeding notice:', err);
          });
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to storage:', e);
    }
  }, [categories]);

  // Sync products to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }, [products]);

  // Sync cart & favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Product CRUD Methods with automatic Firestore tienda1 sync
  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const existingIds = products.map(p => p.id);
    const cleanId = (productData.id && !productData.id.startsWith('prod-'))
      ? productData.id
      : generateCleanProductId(productData.name || 'nuevo-producto', existingIds);

    const slug = cleanId;

    // Unblock this ID from deleted list in localStorage
    try {
      const deletedSet = getDeletedProductIds();
      if (deletedSet.has(cleanId)) {
        deletedSet.delete(cleanId);
        localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(Array.from(deletedSet)));
      }
    } catch (e) {
      console.error(e);
    }

    const newProduct: Product = {
      id: cleanId,
      name: productData.name?.trim() || 'Nuevo Producto 3D',
      slug,
      category: productData.category || 'jarras',
      categoryLabel: productData.categoryLabel || 'Jarras',
      description: productData.description || 'Pieza impresa en 3D con filamento de alta precisión.',
      longDescription: productData.longDescription || 'Fabricado con filamento seleccionado de alto rendimiento y terminación superficial optimizada.',
      price: Number(productData.price) || 5000,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      isOffer: Boolean(productData.isOffer),
      discountPercent: productData.discountPercent || (productData.originalPrice && productData.price ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : undefined),
      image: productData.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      additionalImages: productData.additionalImages || [],
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      stockCount: productData.stockCount !== undefined ? productData.stockCount : 10,
      printMaterial: productData.printMaterial || 'PLA+',
      dimensions: productData.dimensions || '10 x 10 x 10 cm',
      printTime: productData.printTime || '3 hs 30 min',
      colors: productData.colors && productData.colors.length > 0 ? productData.colors : [
        { name: 'Negro Mate', hex: '#18181B' },
        { name: 'Naranja Thunder', hex: '#EA580C' },
        { name: 'Blanco Nieve', hex: '#F9FAFB' }
      ],
      tags: productData.tags || ['Nuevo', 'Impresión 3D'],
      isFeatured: Boolean(productData.isFeatured)
    };

    // Update state immediately
    setProducts(prev => [newProduct, ...prev.filter(p => p.id !== cleanId)]);

    // Await save to Firestore database tienda1
    const res = await saveProductToFirestore(newProduct);
    if (res.success) {
      console.log(`[Firestore tienda1] Producto "${newProduct.name}" guardado exitosamente con ID "${cleanId}"`);
      addToast(`¡Producto "${newProduct.name}" guardado en Firebase (tienda1) como "${cleanId}"!`, 'success');
    } else {
      console.error(`[Firestore tienda1] Error guardando producto "${newProduct.name}":`, res.error);
      addToast(`Aviso Firebase: ${res.error || 'No se pudo guardar en la nube'}`, 'error');
      throw new Error(res.error || 'Error al guardar el producto en Firestore');
    }

    return newProduct;
  };

  const updateProduct = async (productId: string, updatedFields: Partial<Product>): Promise<boolean> => {
    let productToSync: Product | null = null;
    let oldIdToDelete: string | null = null;

    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx === -1) return prev;
      const updated = [...prev];
      const current = updated[idx];

      let targetId = current.id;
      // If the current product has an ugly prod-XXX ID, upgrade it to the readable name!
      if (current.id.startsWith('prod-')) {
        const otherIds = prev.filter(p => p.id !== productId).map(p => p.id);
        targetId = generateCleanProductId(updatedFields.name || current.name, otherIds);
        oldIdToDelete = current.id;
      }

      const isOffer = updatedFields.isOffer !== undefined ? updatedFields.isOffer : current.isOffer;
      let discountPercent = updatedFields.discountPercent ?? current.discountPercent;
      const newPrice = updatedFields.price ?? current.price;
      const newOriginal = updatedFields.originalPrice ?? current.originalPrice;

      if (newOriginal && newPrice && newOriginal > newPrice) {
        discountPercent = Math.round(((newOriginal - newPrice) / newOriginal) * 100);
      }

      const mergedProduct: Product = {
        ...current,
        ...updatedFields,
        id: targetId,
        slug: targetId,
        isOffer,
        discountPercent,
        inStock: updatedFields.inStock !== undefined ? updatedFields.inStock : (updatedFields.stockCount !== undefined ? updatedFields.stockCount > 0 : current.inStock)
      };

      updated[idx] = mergedProduct;
      productToSync = mergedProduct;
      return updated;
    });

    // Delete old document from Firestore if ID was migrated
    if (oldIdToDelete) {
      deleteProductFromFirestore(oldIdToDelete).catch(e => console.warn(e));
    }

    // Sync to Firestore tienda1
    let success = false;
    if (productToSync) {
      const res = await saveProductToFirestore(productToSync);
      success = res.success;
      if (!res.success) {
        console.warn('Error updating product in Firestore:', res.error);
        addToast(`Error al actualizar en Firebase: ${res.error}`, 'error');
      } else {
        addToast('Producto actualizado y guardado en Firebase tienda1', 'success');
      }
    } else {
      const res = await updateProductInFirestore(productId, updatedFields);
      success = res.success;
      if (!res.success) {
        console.warn('Error updating product fields in Firestore:', res.error);
        addToast(`Error al actualizar en Firebase: ${res.error}`, 'error');
      } else {
        addToast('Producto actualizado y guardado en Firebase tienda1', 'success');
      }
    }

    // Also update quickViewProduct if currently viewed
    if (quickViewProduct && (quickViewProduct.id === productId || quickViewProduct.id === productToSync?.id)) {
      setQuickViewProduct(prev => prev ? ({ ...prev, ...updatedFields }) : null);
    }

    return success;
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const target = prev.find(p => p.id === productId);
      const filtered = prev.filter(p => p.id !== productId);
      if (target) {
        addToast(`Producto "${target.name}" eliminado`, 'info');
      }
      return filtered;
    });

    // Track deleted product ID so default list doesn't resurrect it on refresh
    try {
      const deletedSet = getDeletedProductIds();
      deletedSet.add(productId);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(Array.from(deletedSet)));
    } catch (e) {
      console.error(e);
    }

    // Delete from Firestore tienda1
    deleteProductFromFirestore(productId).catch(err => {
      console.warn('Error deleting product from Firestore:', err);
    });

    if (quickViewProduct && quickViewProduct.id === productId) {
      setQuickViewProduct(null);
    }
  };

  const deleteProductsByName = async (term: string): Promise<number> => {
    const termClean = term.toLowerCase().trim();
    const toDeleteIds: string[] = [];

    setProducts(prev => {
      const remaining: Product[] = [];
      for (const p of prev) {
        const normName = (p.name || '').toLowerCase();
        const normId = (p.id || '').toLowerCase();
        if (normName.includes(termClean) || normId.includes(termClean.replace(/\s+/g, '-'))) {
          toDeleteIds.push(p.id);
        } else {
          remaining.push(p);
        }
      }
      return remaining;
    });

    const deletedSet = getDeletedProductIds();
    toDeleteIds.forEach(id => deletedSet.add(id));
    try {
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(Array.from(deletedSet)));
    } catch (e) {
      console.error(e);
    }

    // Firestore deletion from tienda1
    const res = await deleteProductsByNameFromFirestore(term);
    for (const id of toDeleteIds) {
      await deleteProductFromFirestore(id).catch(() => {});
    }

    const totalPurged = Math.max(toDeleteIds.length, res.deletedCount);
    addToast(`Se eliminaron ${totalPurged} productos coincidentes con "${term}" de Firebase tienda1`, 'success');
    return totalPurged;
  };

  const updateStock = (productId: string, inStock: boolean, stockCount?: number) => {
    let newCount = 0;
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          newCount = stockCount !== undefined ? stockCount : (inStock ? Math.max(1, p.stockCount || 10) : 0);
          return {
            ...p,
            inStock: inStock && newCount > 0,
            stockCount: newCount
          };
        }
        return p;
      })
    );

    // Sync stock changes to Firestore tienda1
    updateProductInFirestore(productId, { 
      inStock: inStock && (stockCount !== undefined ? stockCount > 0 : true), 
      stockCount: stockCount !== undefined ? stockCount : (inStock ? 10 : 0) 
    }).catch(err => {
      console.warn('Error updating stock in Firestore:', err);
    });

    addToast('Stock y disponibilidad actualizados', 'success');
  };

  const resetProductsToDefault = () => {
    const formatted = INITIAL_PRODUCTS.map(p => ({
      ...p,
      stockCount: p.stockCount ?? (p.inStock ? 15 : 0)
    }));
    setProducts(formatted);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(formatted));
      localStorage.removeItem(DELETED_PRODUCTS_KEY);
    } catch (e) {
      console.error(e);
    }
    
    // Also seed to Firestore
    seedProductsToFirestore(formatted).then(() => {
      console.log('Default products synchronized to Firestore');
    }).catch(e => console.warn(e));

    addToast('Catálogo restablecido y sincronizado con Firebase', 'info');
  };

  const setAllProductsOnDemand = async () => {
    addToast('Configurando todo el catálogo a modo Fabricación a Demanda (sin límite de stock)...', 'info');
    const updated = products.map(p => ({
      ...p,
      inStock: true,
      onDemandOnly: true,
      stockCount: 999
    }));
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsStockDisabledState(true);
    try {
      localStorage.setItem(STOCK_DISABLED_KEY, JSON.stringify(true));
    } catch (e) {
      console.error(e);
    }
    await seedProductsToFirestore(updated);
    addToast('¡Todo el catálogo listo para pedir por WhatsApp sin límites de stock!', 'success');
  };

  const restoreDefaultStockLimits = async () => {
    addToast('Restableciendo control de stock con cantidades numéricas...', 'info');
    const updated = products.map(p => ({
      ...p,
      inStock: true,
      onDemandOnly: false,
      stockCount: p.stockCount && p.stockCount > 0 ? p.stockCount : 15
    }));
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsStockDisabledState(false);
    try {
      localStorage.setItem(STOCK_DISABLED_KEY, JSON.stringify(false));
    } catch (e) {
      console.error(e);
    }
    await seedProductsToFirestore(updated);
    addToast('¡Control de stock tradicional reactivado!', 'success');
  };

  const syncAllProductsToFirestore = async (): Promise<number> => {
    addToast('Sincronizando catálogo completo con nombres legibles en Firebase tienda1...', 'info');
    try {
      // Ensure all products have clean, readable IDs matching their name and remove old prod- IDs
      const sanitized = products.map((p) => {
        if (!p.id || p.id.startsWith('prod-')) {
          const cleanId = generateCleanProductId(p.name || 'producto-3d', products.map(item => item.id));
          if (p.id && p.id.startsWith('prod-')) {
            deleteProductFromFirestore(p.id).catch(e => console.warn(e));
          }
          return { ...p, id: cleanId, slug: cleanId };
        }
        return p;
      });
      setProducts(sanitized);

      // 1. Sync categories
      const catCount = await seedCategoriesToFirestore(categories);
      // 2. Sync products with clean readable IDs
      const prodCount = await seedProductsToFirestore(sanitized);
      
      if (prodCount > 0 || catCount > 0) {
        addToast(
          `¡Catálogo sincronizado con éxito! (${prodCount} productos guardados con sus nombres legibles en Firestore tienda1)`,
          'success'
        );
      } else {
        addToast('No se pudieron sincronizar los productos con Firebase', 'error');
      }
      return prodCount;
    } catch (err: any) {
      console.warn('Sync error:', err);
      addToast(`Error al sincronizar: ${err?.message || 'Error de red'}`, 'error');
      return 0;
    }
  };

  const disableAllFeatured = async (): Promise<void> => {
    addToast('Desactivando estado destacado de todos los productos...', 'info');
    const updated = products.map(p => ({
      ...p,
      isFeatured: false
    }));
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    await seedProductsToFirestore(updated);
    addToast('¡Todos los productos destacados han sido desactivados!', 'success');
  };

  const toggleFeatured = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const nextState = !p.isFeatured;
          updateProductInFirestore(productId, { isFeatured: nextState }).catch(e => console.warn(e));
          addToast(`Producto "${p.name}" ${nextState ? 'marcado como destacado' : 'quitado de destacados'}`, 'info');
          return { ...p, isFeatured: nextState };
        }
        return p;
      })
    );
  };

  // Category Management Methods
  const addCategory = (categoryData: Partial<Category>): Category => {
    const fallbackId = categoryData.name 
      ? categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : `cat-${Date.now()}`;
    
    const newCategory: Category = {
      id: categoryData.id || fallbackId || `cat-${Date.now()}`,
      name: categoryData.name || 'Nueva Categoría',
      description: categoryData.description || '',
      image: categoryData.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      count: categoryData.count || 0,
      iconName: categoryData.iconName || 'Sparkles'
    };

    setCategories(prev => {
      const exists = prev.some(c => c.id === newCategory.id);
      if (exists) {
        return prev.map(c => c.id === newCategory.id ? { ...c, ...newCategory } : c);
      }
      return [...prev, newCategory];
    });

    saveCategoryToFirestore(newCategory).catch(e => console.warn(e));
    addToast(`¡Categoría "${newCategory.name}" agregada con éxito!`, 'success');
    return newCategory;
  };

  const updateCategory = (categoryId: string, updatedFields: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id === categoryId) {
          const updated = { ...c, ...updatedFields };
          saveCategoryToFirestore(updated).catch(e => console.warn(e));
          return updated;
        }
        return c;
      })
    );
    addToast('Portada de categoría actualizada con éxito', 'success');
  };

  const deleteCategory = (categoryId: string) => {
    const catToDelete = categories.find(c => c.id === categoryId);

    // Save to deleted set in localStorage so it is never resurrected
    try {
      const deletedIds = getDeletedCategoryIds();
      deletedIds.add(categoryId);
      localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(Array.from(deletedIds)));
    } catch (e) {
      console.error(e);
    }

    setCategories(prev => {
      const updated = prev.filter(c => c.id !== categoryId);
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Reset selectedCategory filter if it was the deleted category
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }

    deleteCategoryFromFirestore(categoryId).catch(e => console.warn(e));
    addToast(`Categoría "${catToDelete?.name || categoryId}" eliminada con éxito`, 'info');
  };

  const resetCategoriesToDefault = async () => {
    try {
      localStorage.removeItem(DELETED_CATEGORIES_KEY);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    } catch (e) {
      console.error(e);
    }
    setCategories(INITIAL_CATEGORIES);
    await seedCategoriesToFirestore(INITIAL_CATEGORIES);
    addToast('Portadas e información de categorías restauradas de fábrica', 'success');
  };

  const syncAllCategoriesToFirestore = async (): Promise<number> => {
    addToast('Sincronizando categorías con Firebase tienda1...', 'info');
    const count = await seedCategoriesToFirestore(categories);
    if (count > 0) {
      addToast(`¡${count} categorías sincronizadas en Firebase (tienda1)!`, 'success');
    } else {
      addToast('No se pudieron sincronizar las categorías', 'error');
    }
    return count;
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: { name: string; hex: string },
    notes?: string
  ) => {
    const color = selectedColor || product.colors[0] || { name: 'Estándar', hex: '#EA580C' };
    
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color, customNotes: notes }];
      }
    });

    addToast(`"${product.name}" agregado (${quantity} un.)`, 'success');
  };

  const removeFromCart = (productId: string, colorName?: string) => {
    setCart(prev =>
      prev.filter(item => {
        if (item.product.id !== productId) return true;
        if (colorName && item.selectedColor.name !== colorName) return true;
        return false;
      })
    );
    addToast('Producto eliminado', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, colorName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && (!colorName || item.selectedColor.name === colorName)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const restoreCart = (items: CartItem[]) => {
    if (!items || items.length === 0) return;
    setCart(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
    addToast('Productos restaurados al carrito', 'info');
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Eliminado de tus favoritos', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('¡Guardado en tus favoritos!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'THUNDER10' || cleanCode === 'PRIMERPEDIDO' || cleanCode === 'BIENVENIDA') {
      setAppliedCoupon({ code: cleanCode, percent: 10 });
      addToast(`¡Cupón ${cleanCode} aplicado! 10% OFF en tu pedido`, 'success');
      return true;
    } else if (cleanCode === 'THUNDER20') {
      setAppliedCoupon({ code: 'THUNDER10', percent: 10 });
      addToast('¡Cupón aplicado! 10% OFF en tu primer pedido', 'success');
      return true;
    } else if (cleanCode === 'ENVIOCABA') {
      setAppliedCoupon({ code: 'ENVIOCABA', percent: 15 });
      addToast('¡Cupón aplicado! 15% OFF promocional', 'success');
      return true;
    } else {
      addToast('El cupón ingresado no es válido', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Cupón removido', 'info');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.percent) / 100) : 0;
  
  let shippingCost = 0;
  if (selectedShipping === 'retiro_taller') {
    shippingCost = 0;
  } else if (selectedShipping === 'caba_express') {
    shippingCost = subtotal >= 35000 ? 0 : 2800;
  } else if (selectedShipping === 'correo_argentino') {
    shippingCost = subtotal >= 45000 ? 0 : 4500;
  }

  const total = Math.max(0, subtotal - discount + shippingCost);

  const placeOrder = (customer: CustomerInfo): OrderDetails => {
    const orderNumber = `TH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderDetails = {
      orderNumber,
      date: new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cart],
      customer,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod: customer.paymentMethod === 'mercadopago' ? 'Mercado Pago' : customer.paymentMethod === 'transferencia' ? 'Transferencia Bancaria (-10%)' : 'Efectivo contra entrega',
      status: 'en_produccion'
    };

    // Save to Firestore asynchronously
    saveOrderToFirestore(newOrder).then((docId) => {
      if (docId) {
        console.log(`Order #${newOrder.orderNumber} successfully saved to Firestore with ID ${docId}`);
      }
    }).catch(err => {
      console.warn('Non-blocking Firestore order save warning:', err);
    });

    setLastOrder(newOrder);
    clearCart();
    setCurrentView('order-success');
    return newOrder;
  };

  const resetOrder = () => {
    setLastOrder(null);
    setCurrentView('shop');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restoreCart,
        totalItems,
        subtotal,
        discount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingCost,
        selectedShipping,
        setSelectedShipping,
        total,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProductsByName,
        updateStock,
        resetProductsToDefault,
        syncAllProductsToFirestore,
        disableAllFeatured,
        toggleFeatured,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        syncAllCategoriesToFirestore,
        isStockDisabled,
        setIsStockDisabled,
        whatsappNumber,
        setWhatsappNumber,
        setAllProductsOnDemand,
        restoreDefaultStockLimits,
        isAdminOpen,
        setIsAdminOpen,
        adminEditProduct,
        setAdminEditProduct,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCustomModalOpen,
        setIsCustomModalOpen,
        isUserModalOpen,
        setIsUserModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        favorites,
        toggleFavorite,
        isFavorite,
        toasts,
        addToast,
        removeToast,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        lastOrder,
        placeOrder,
        resetOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
