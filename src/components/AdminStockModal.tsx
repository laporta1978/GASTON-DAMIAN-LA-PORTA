import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  X, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Package, 
  PackageCheck, 
  PackageX, 
  Layers, 
  DollarSign, 
  Tag, 
  Sparkles, 
  Star,
  ShoppingCart,
  RotateCcw, 
  Eye, 
  EyeOff,
  Image as ImageIcon, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Box,
  Palette,
  Clock,
  Maximize2,
  Copy,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  UserCheck,
  LogOut,
  User,
  ShieldAlert,
  CloudUpload,
  Database,
  RefreshCw,
  UploadCloud,
  Camera,
  Loader2,
  Link2,
  FileCheck2,
  ExternalLink,
  ImagePlus,
  CheckCircle,
  FileImage,
  MessageCircle,
  PhoneCall,
  Zap,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product, Category } from '../types';
import { CATEGORIES } from '../data/products';
import { uploadProductImageToFirebaseStorage, compressAndOptimizeImage } from '../services/storage';
import { updateProductInFirestore, testFirestoreConnection } from '../services/db';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CategoryEditModal } from './CategoryEditModal';
import { ProductDescription } from './ProductDescription';

// Storage keys for supervisor credentials & session
const SUPERVISOR_AUTH_KEY = 'thunder3d_supervisor_creds_v1';
const SUPERVISOR_SESSION_KEY = 'thunder3d_supervisor_active_session_v1';

// Sample High-Quality 3D Printing Preset Images for Quick Selection
const PRESET_IMAGES = [
  { label: 'Chopp Vikingo Nórdico', url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80' },
  { label: 'Jarra Gamer Temática', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80' },
  { label: 'Chopp Barril Roble', url: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=700&q=80' },
  { label: 'Mate Imperial Térmico', url: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=700&q=80' },
  { label: 'Sellos Texturadores Cerámica', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80' },
  { label: 'Pack Cortantes Repostería', url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=700&q=80' },
  { label: 'Llaveros 3D Souvenirs', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80' },
  { label: 'Vasos Botellas Recicladas', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80' },
];

const PRESET_COLORS = [
  { name: 'Negro Mate', hex: '#18181B' },
  { name: 'Naranja Thunder', hex: '#EA580C' },
  { name: 'Blanco Nieve', hex: '#F9FAFB' },
  { name: 'Gris Grafito', hex: '#4B5563' },
  { name: 'Rojo Fuego', hex: '#DC2626' },
  { name: 'Azul Cobalto', hex: '#2563EB' },
  { name: 'Oro Seda (Silk)', hex: '#D97706' },
  { name: 'Verde Militar', hex: '#15803D' },
  { name: 'Violeta Neón', hex: '#7C3AED' },
  { name: 'Madera (Wood)', hex: '#92400E' },
];

const PRINT_MATERIALS = [
  'PLA+',
  'PLA+ Silk',
  'PETG',
  'Resina 4K',
  'TPU Flexible',
  'PLA Mármol',
  'PETG Carbon Fiber',
  'Nylon PA12',
  'PLA Wood (Madera)'
];

export const AdminStockModal: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
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
    isCartDisabled,
    setIsCartDisabled,
    whatsappNumber,
    setWhatsappNumber,
    setAllProductsOnDemand,
    restoreDefaultStockLimits,
    isAdminOpen, 
    setIsAdminOpen,
    adminEditProduct,
    setAdminEditProduct,
    setQuickViewProduct,
    addToast
  } = useCart();

  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [isSyncingCategories, setIsSyncingCategories] = useState(false);
  const [categoryToEditInAdmin, setCategoryToEditInAdmin] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Live Firestore database diagnostic status
  const [dbStatus, setDbStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    productsCount?: number;
    categoriesCount?: number;
    error?: string;
  }>({ tested: false, loading: false });

  const handleCheckFirebase = async () => {
    setDbStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await testFirestoreConnection();
      setDbStatus({
        tested: true,
        loading: false,
        success: res.success,
        productsCount: res.productsCount,
        categoriesCount: res.categoriesCount,
        error: res.error
      });
      if (res.success) {
        addToast(`Firebase tienda1 conectado: ${res.productsCount} productos y ${res.categoriesCount} categorías en Firestore`, 'success');
      } else {
        addToast(`Aviso Firestore: ${res.error || 'No se pudo leer la base de datos'}`, 'error');
      }
    } catch (err: any) {
      setDbStatus({
        tested: true,
        loading: false,
        success: false,
        error: err?.message || 'Error de conexión'
      });
      addToast('Error al verificar conexión con Firebase', 'error');
    }
  };

  // --- SUPERVISOR AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const activeSession = localStorage.getItem(SUPERVISOR_SESSION_KEY) || sessionStorage.getItem(SUPERVISOR_SESSION_KEY);
      return activeSession === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isAdminOpen && isAuthenticated && !dbStatus.tested && !dbStatus.loading) {
      handleCheckFirebase();
    }
  }, [isAdminOpen, isAuthenticated]);

  const [authUsername, setAuthUsername] = useState('supervisor');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rememberSession, setRememberSession] = useState(true);
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  // Password Change Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  // Get stored supervisor password (or default 'thunder3d')
  const getSupervisorCredentials = () => {
    try {
      const saved = localStorage.getItem(SUPERVISOR_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return { username: 'supervisor', password: 'thunder3d', role: 'Supervisor General' };
  };

  const handleSupervisorLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');

    const creds = getSupervisorCredentials();
    const cleanUser = authUsername.trim().toLowerCase();
    const cleanPass = authPassword.trim();

    // Valid supervisor usernames: configured username, 'supervisor', 'admin', 'tonga', 'tongathunder'
    const isUserValid = (
      cleanUser === creds.username.toLowerCase() ||
      cleanUser === 'supervisor' ||
      cleanUser === 'admin' ||
      cleanUser === 'tonga' ||
      cleanUser === 'tongathunder'
    );

    // Valid supervisor passwords: configured password, default 'thunder3d', or 'admin' / '1234'
    const isPassValid = (
      cleanPass === creds.password ||
      cleanPass === 'thunder3d' ||
      cleanPass === 'admin' ||
      cleanPass === '1234'
    );

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      setAuthSuccessNotice('¡Identidad verificada como Supervisor!');
      if (rememberSession) {
        localStorage.setItem(SUPERVISOR_SESSION_KEY, 'true');
      } else {
        sessionStorage.setItem(SUPERVISOR_SESSION_KEY, 'true');
      }
      setTimeout(() => setAuthSuccessNotice(''), 3000);
    } else {
      setAuthError('Usuario o contraseña de supervisor incorrectos. Verificá los datos ingresados.');
    }
  };

  const handleSupervisorLogout = () => {
    setIsAuthenticated(false);
    setAuthPassword('');
    localStorage.removeItem(SUPERVISOR_SESSION_KEY);
    sessionStorage.removeItem(SUPERVISOR_SESSION_KEY);
  };

  const handleFillDemoCreds = () => {
    setAuthUsername('supervisor');
    setAuthPassword('thunder3d');
    setAuthError('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    const creds = getSupervisorCredentials();
    if (currentPass !== creds.password && currentPass !== 'thunder3d' && currentPass !== 'admin') {
      setChangePassError('La contraseña actual ingresada no es válida.');
      return;
    }

    if (newPass.length < 4) {
      setChangePassError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (newPass !== confirmNewPass) {
      setChangePassError('Las nuevas contraseñas no coinciden.');
      return;
    }

    const updatedCreds = {
      ...creds,
      password: newPass,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(SUPERVISOR_AUTH_KEY, JSON.stringify(updatedCreds));
    setChangePassSuccess('¡Contraseña de supervisor actualizada con éxito!');
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setChangePassSuccess('');
    }, 1800);
  };

  // Local Admin Tab Navigation: 'inventory' | 'create' | 'edit' | 'categories'
  const [activeTab, setActiveTab] = useState<'inventory' | 'create' | 'edit' | 'categories'>('inventory');
  
  // Search & Filters in Admin
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'low_stock'>('all');

  // Confirmation Delete Modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    category: any;
    categoryLabel: string;
    description: string;
    longDescription: string;
    price: number;
    originalPrice?: number;
    isOffer: boolean;
    inStock: boolean;
    onDemandOnly?: boolean;
    stockCount: number;
    printMaterial: string;
    dimensions: string;
    printTime: string;
    image: string;
    additionalImages: string[];
    colors: { name: string; hex: string }[];
    tags: string[];
    isFeatured: boolean;
  }>({
    name: '',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: '',
    longDescription: '',
    price: 6500,
    originalPrice: 8000,
    isOffer: false,
    inStock: true,
    onDemandOnly: false,
    stockCount: 12,
    printMaterial: 'PLA+',
    dimensions: '12 x 10 x 5 cm',
    printTime: '3 hs 30 min',
    image: PRESET_IMAGES[0].url,
    additionalImages: [],
    colors: [PRESET_COLORS[0], PRESET_COLORS[1], PRESET_COLORS[2]],
    tags: ['Nuevo', 'Destacado'],
    isFeatured: true
  });

  const [tagInput, setTagInput] = useState('');

  // 3-Photo Slots Management State (0: Principal, 1: Detalle, 2: Perspectiva)
  const [activePhotoSlot, setActivePhotoSlot] = useState<0 | 1 | 2>(0);

  // Firebase Storage Image Upload States
  const [imageSourceTab, setImageSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [quickUploadLoadingId, setQuickUploadLoadingId] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveProductError, setSaveProductError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableFileInputRef = useRef<HTMLInputElement>(null);
  const [targetQuickProductId, setTargetQuickProductId] = useState<string | null>(null);

  // Main Image Upload Handler for Admin Modal Form
  const handleUploadImageFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('El archivo seleccionado no es una imagen válida.');
      addToast('Por favor seleccioná un archivo de imagen (PNG, JPG, WEBP, etc.)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen supera el límite de 10MB.');
      addToast('El archivo es demasiado pesado (máximo 10MB)', 'error');
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);
    setUploadProgress(20);
    setUploadStatusText('Optimizando foto para catálogo 3D...');
    setUploadedFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    });

    try {
      // 1. Instant client-side compression to permanent, high-definition WebP (<30KB)
      const { dataUrl: instantDataUrl } = await compressAndOptimizeImage(file, 720, 720, 0.75);

      // Immediately set the permanent image data in state (NEVER a temporary browser RAM blob)
      if (activePhotoSlot === 0) {
        setFormData(prev => ({ ...prev, image: instantDataUrl }));
      } else {
        const targetIdx = activePhotoSlot - 1;
        setFormData(prev => {
          const updated = [...(prev.additionalImages || [])];
          updated[targetIdx] = instantDataUrl;
          return { ...prev, additionalImages: updated };
        });
      }

      setUploadProgress(60);
      setUploadStatusText('Guardando en Firebase...');

      // 2. Upload to Firebase Storage or use optimized image
      const downloadUrl = await uploadProductImageToFirebaseStorage(
        file,
        formData.id || 'catalogo',
        (progress, state) => {
          setUploadProgress(progress);
          if (state === 'running') {
            setUploadStatusText(`Procesando foto ${activePhotoSlot + 1}... ${progress}%`);
          } else if (state === 'success') {
            setUploadStatusText(`¡Foto ${activePhotoSlot + 1} lista con éxito!`);
          }
        }
      );

      const finalUrl = downloadUrl || instantDataUrl;

      if (activePhotoSlot === 0) {
        setFormData(prev => ({ ...prev, image: finalUrl }));
      } else {
        const targetIdx = activePhotoSlot - 1;
        setFormData(prev => {
          const updated = [...(prev.additionalImages || [])];
          updated[targetIdx] = finalUrl;
          return { ...prev, additionalImages: updated };
        });
      }
      addToast(`¡Foto ${activePhotoSlot + 1} procesada y guardada con éxito!`, 'success');

      // 3. If currently editing an existing product, immediately sync to Firestore tienda1
      if (formData.id && activeTab === 'edit') {
        const payload = activePhotoSlot === 0
          ? { image: finalUrl }
          : {
              additionalImages: (() => {
                const list = [...(formData.additionalImages || [])];
                list[activePhotoSlot - 1] = finalUrl;
                return list;
              })()
            };
        const syncResult = await updateProductInFirestore(formData.id, payload);
        if (syncResult.success) {
          updateProduct(formData.id, payload);
          addToast('Documento en Firestore tienda1 actualizado con la nueva imagen', 'success');
        } else {
          addToast(`Aviso Firebase: ${syncResult.error || 'No se pudo sincronizar en Firestore'}`, 'warning');
        }
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setUploadError(err?.message || 'Error al procesar imagen.');
      addToast('Error al procesar la imagen.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle deleting photo from any slot (including Slot 0 / Main Photo)
  const handleDeleteSlotPhoto = async (slotIdx: number) => {
    if (slotIdx === 0) {
      setFormData(prev => ({ ...prev, image: '' }));
      if (formData.id && activeTab === 'edit') {
        try {
          await updateProductInFirestore(formData.id, { image: '' });
          updateProduct(formData.id, { image: '' });
        } catch (e) {
          console.warn('Error saving deleted main photo to firestore:', e);
        }
      }
      addToast('Foto principal eliminada. Podés subir una nueva o elegir una del taller.', 'info');
    } else {
      const targetIdx = slotIdx - 1;
      let nextAdditional: string[] = [];
      setFormData(prev => {
        const list = [...(prev.additionalImages || [])];
        list[targetIdx] = '';
        nextAdditional = list.filter(Boolean);
        return { ...prev, additionalImages: nextAdditional };
      });
      if (formData.id && activeTab === 'edit') {
        try {
          await updateProductInFirestore(formData.id, { additionalImages: nextAdditional });
          updateProduct(formData.id, { additionalImages: nextAdditional });
        } catch (e) {
          console.warn('Error saving deleted additional photo to firestore:', e);
        }
      }
      addToast(`Foto ${slotIdx + 1} eliminada`, 'info');
    }
  };

  // Promote any additional photo (Slot 2 or 3) to be the main photo (Slot 1)
  const handleMakePrimary = async (slotIdx: number) => {
    if (slotIdx === 0) return;
    const currentAdditional = formData.additionalImages || [];
    const targetImg = currentAdditional[slotIdx - 1];
    if (!targetImg) return;

    const oldMain = formData.image;
    const newAdditional = [...currentAdditional];
    if (oldMain) {
      newAdditional[slotIdx - 1] = oldMain;
    } else {
      newAdditional.splice(slotIdx - 1, 1);
    }
    const cleanAdditional = newAdditional.filter(Boolean);

    setFormData(prev => ({
      ...prev,
      image: targetImg,
      additionalImages: cleanAdditional
    }));
    setActivePhotoSlot(0);

    if (formData.id && activeTab === 'edit') {
      try {
        await updateProductInFirestore(formData.id, {
          image: targetImg,
          additionalImages: cleanAdditional
        });
        updateProduct(formData.id, {
          image: targetImg,
          additionalImages: cleanAdditional
        });
      } catch (e) {
        console.warn('Error setting primary photo in firestore:', e);
      }
    }
    addToast('¡Foto establecida como Principal (Portada)!', 'success');
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleUploadImageFile(file);
    }
  };

  // Quick Table Upload Trigger (from inventory row)
  const handleTriggerQuickUpload = (productId: string) => {
    setTargetQuickProductId(productId);
    if (tableFileInputRef.current) {
      tableFileInputRef.current.value = '';
      tableFileInputRef.current.click();
    }
  };

  const handleQuickTableFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const productId = targetQuickProductId;
    if (!file || !productId) return;

    if (!file.type.startsWith('image/')) {
      addToast('El archivo debe ser una imagen válida', 'error');
      return;
    }

    setQuickUploadLoadingId(productId);
    addToast('Procesando foto y sincronizando con Firebase...', 'info');

    try {
      const downloadUrl = await uploadProductImageToFirebaseStorage(file, productId);
      const syncResult = await updateProductInFirestore(productId, { image: downloadUrl });
      updateProduct(productId, { image: downloadUrl });
      if (syncResult.success) {
        addToast('¡Foto guardada en Firebase Firestore tienda1 con éxito!', 'success');
      } else {
        addToast(`Aviso Firebase: ${syncResult.error || 'Foto guardada en catálogo local'}`, 'warning');
      }
    } catch (err) {
      console.error('Error al subir foto rápida:', err);
      addToast('Error al procesar la imagen.', 'error');
    } finally {
      setQuickUploadLoadingId(null);
      setTargetQuickProductId(null);
    }
  };

  // Handle opening edit from inventory
  const handleStartEdit = (product: Product) => {
    setAdminEditProduct(product);
    setActivePhotoSlot(0);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      isOffer: Boolean(product.isOffer),
      inStock: product.inStock,
      onDemandOnly: Boolean(product.onDemandOnly),
      stockCount: product.stockCount ?? (product.inStock ? 10 : 0),
      printMaterial: product.printMaterial,
      dimensions: product.dimensions,
      printTime: product.printTime,
      image: product.image,
      additionalImages: product.additionalImages || [],
      colors: product.colors || [PRESET_COLORS[0], PRESET_COLORS[1]],
      tags: product.tags || [],
      isFeatured: Boolean(product.isFeatured)
    });
    setActiveTab('edit');
  };

  const handleStartCreate = (initialCategory?: string) => {
    setAdminEditProduct(null);
    setActivePhotoSlot(0);
    const targetCatId = initialCategory || (categories[0]?.id) || 'jarras';
    const foundCat = categories.find(c => c.id === targetCatId) || CATEGORIES[0] || { id: 'jarras', name: 'Jarras' };
    setFormData({
      name: '',
      category: foundCat.id,
      categoryLabel: foundCat.name,
      description: '',
      longDescription: '',
      price: 7500,
      originalPrice: 9500,
      isOffer: true,
      inStock: true,
      onDemandOnly: isStockDisabled,
      stockCount: 15,
      printMaterial: 'PLA+',
      dimensions: '14 x 8 x 6 cm',
      printTime: '4 hs 15 min',
      image: PRESET_IMAGES[0].url,
      additionalImages: [],
      colors: [PRESET_COLORS[0], PRESET_COLORS[1], PRESET_COLORS[2]],
      tags: ['Nuevo', 'Impresión 3D', 'Taller'],
      isFeatured: false
    });
    setActiveTab('create');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isUploadingImage) {
      addToast('Aguardá un instante a que termine de procesarse la foto', 'warning');
      return;
    }

    setIsSavingProduct(true);
    setSaveProductError(null);

    try {
      const selectedCategoryObj = categories.find(c => c.id === formData.category) || CATEGORIES.find(c => c.id === formData.category);
      const categoryLabel = selectedCategoryObj ? selectedCategoryObj.name : (formData.categoryLabel || 'General');

      if (activeTab === 'edit' && formData.id) {
        await updateProduct(formData.id, {
          ...formData,
          categoryLabel,
          inStock: formData.onDemandOnly ? true : (formData.inStock && formData.stockCount > 0),
        });
      } else {
        await addProduct({
          ...formData,
          categoryLabel,
          inStock: formData.onDemandOnly ? true : (formData.inStock && formData.stockCount > 0),
        });
      }

      setActiveTab('inventory');
      setAdminEditProduct(null);
    } catch (err: any) {
      console.error('Error al guardar producto:', err);
      const msg = err?.message || 'Error al guardar el producto en Firebase';
      setSaveProductError(msg);
      addToast(`Error al guardar en Firebase: ${msg}`, 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleToggleColor = (preset: { name: string; hex: string }) => {
    setFormData(prev => {
      const exists = prev.colors.some(c => c.name === preset.name);
      if (exists) {
        if (prev.colors.length <= 1) return prev; // Keep at least one
        return { ...prev, colors: prev.colors.filter(c => c.name !== preset.name) };
      } else {
        return { ...prev, colors: [...prev.colors, preset] };
      }
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  // Inventory stats calculations
  const stats = useMemo(() => {
    const total = products.length;
    const inStockItems = products.filter(p => p.inStock && (p.stockCount === undefined || p.stockCount > 0));
    const outOfStockItems = products.filter(p => !p.inStock || p.stockCount === 0);
    const lowStockItems = products.filter(p => p.inStock && p.stockCount !== undefined && p.stockCount > 0 && p.stockCount <= 5);
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stockCount ?? 1)), 0);

    return {
      total,
      inStockCount: inStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockCount: lowStockItems.length,
      totalInventoryValue
    };
  }, [products]);

  // Filtered list for the table
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Stock status
      const count = product.stockCount ?? (product.inStock ? 10 : 0);
      if (stockStatusFilter === 'in_stock' && (!product.inStock || count === 0)) return false;
      if (stockStatusFilter === 'out_of_stock' && (product.inStock && count > 0)) return false;
      if (stockStatusFilter === 'low_stock' && (!product.inStock || count > 5 || count === 0)) return false;

      // Search term
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchCat = product.categoryLabel.toLowerCase().includes(q);
        const matchMat = product.printMaterial.toLowerCase().includes(q);
        const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchMat && !matchTags) return false;
      }

      return true;
    });
  }, [products, categoryFilter, stockStatusFilter, searchFilter]);

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Admin Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-6xl bg-[#FBFBFA] border border-[#E5E3D8] rounded-[32px] shadow-2xl overflow-hidden z-10 max-h-[94vh] flex flex-col"
      >
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#111111] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B] text-white flex items-center justify-center shadow-md shadow-[#FF6B2B]/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-['Outfit'] tracking-tight">
                  Panel de Administración & Stock 3D
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FF6B2B]/20 text-[#FF6B2B] text-[10px] font-black uppercase tracking-wider border border-[#FF6B2B]/30">
                  Taller Thunder 3D
                </span>
                {isAuthenticated && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supervisor Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                {isAuthenticated 
                  ? 'Gestión de inventario, actualización de stock, precios y catálogo en tiempo real.'
                  : 'Área restringida protegida para supervisores y encargados de taller.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setChangePassError('');
                    setChangePassSuccess('');
                    setShowChangePasswordModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Cambiar contraseña de supervisor"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#FF6B2B]" />
                  <span className="hidden md:inline">Cambiar Clave</span>
                </button>

                <button
                  onClick={handleSupervisorLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Cerrar sesión de supervisor y bloquear panel"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATEKEEPER VIEW */}
        {!isAuthenticated ? (
          <div className="flex-1 p-6 sm:p-10 flex items-center justify-center bg-[#F4F3ED] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white border border-[#E5E3D8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              {/* Lock Badge & Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-[#FF6B2B] flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10 relative">
                  <Lock className="w-8 h-8" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B2B] text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B2B] text-[10px] font-black uppercase tracking-wider mb-1">
                    Control de Acceso
                  </div>
                  <h3 className="text-xl font-black font-['Outfit'] text-neutral-900">
                    Supervisor de Stock 3D
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Ingresá tus credenciales de supervisor para modificar stock, precios y catálogo de piezas.
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSupervisorLogin} className="space-y-4">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    Usuario / Supervisor
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="Ej: supervisor o admin"
                      className="w-full bg-[#FAFAF8] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/10 transition-all placeholder:text-neutral-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Contraseña de supervisor"
                      className="w-full bg-[#FAFAF8] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 pr-10 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/10 transition-all placeholder:text-neutral-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Session Option */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded border-[#E5E3D8] text-[#FF6B2B] focus:ring-[#FF6B2B] w-4 h-4 accent-[#FF6B2B]"
                    />
                    <span>Recordar sesión en este equipo</span>
                  </label>
                </div>

                {/* Error Alert */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-neutral-900/10 active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Desbloquear y Acceder al Stock</span>
                </button>
              </form>

              {/* Helper Quick Access Chip */}
              <div className="pt-4 border-t border-[#EAE7DC] space-y-2 text-center">
                <div className="text-[11px] text-neutral-500 font-medium">
                  Credenciales por defecto del taller:
                </div>
                <div className="inline-flex items-center gap-2 bg-[#F4F3ED] px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-700 border border-[#E5E3D8]">
                  <span>Usuario: <strong>supervisor</strong></span>
                  <span>•</span>
                  <span>Clave: <strong>thunder3d</strong></span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleFillDemoCreds}
                    className="text-[11px] font-bold text-[#FF6B2B] hover:underline"
                  >
                    Completar automáticamente para probar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>

        {/* Tab Switcher & Quick Action Bar */}
        <div className="px-6 py-3 bg-white border-b border-[#EAE7DC] flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('inventory');
                setAdminEditProduct(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventario & Stock ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setAdminEditProduct(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FF6B2B]" />
              <span>Categorías & Portadas ({categories.length})</span>
            </button>

            <button
              onClick={handleStartCreate}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-[#FF6B2B] text-white shadow-xs'
                  : 'bg-orange-50 text-[#FF6B2B] border border-[#FF6B2B]/30 hover:bg-orange-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Nuevo Producto</span>
            </button>

            {activeTab === 'edit' && (
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#FF6B2B]" />
                <span>Editando: {formData.name || 'Producto'}</span>
              </span>
            )}
          </div>

          {/* Quick Database Tools & Firebase Sync */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                setIsSyncingFirebase(true);
                await syncAllProductsToFirestore();
                setIsSyncingFirebase(false);
              }}
              disabled={isSyncingFirebase}
              className="text-[11px] font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Sincroniza todos los productos actuales con la base de datos Firebase tienda1"
            >
              {isSyncingFirebase ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{isSyncingFirebase ? 'Sincronizando...' : 'Subir Catálogo a Firebase'}</span>
            </button>

            <a
              href="https://console.firebase.google.com/project/supple-tree-b9brs/firestore/databases/tienda1/data/~2Fproducts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-neutral-600 hover:text-[#FF6B2B] bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-300 transition-all flex items-center gap-1.5 shadow-xs"
              title="Abrir colección 'products' en la base de datos 'tienda1'"
            >
              <Database className="w-3.5 h-3.5 text-[#FF6B2B]" />
              <span>Ver en Firebase (tienda1)</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] font-bold text-neutral-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
              title="Restablece los productos a los valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Fábrica</span>
            </button>
          </div>

        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: INVENTORY & STOCK MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              
              {/* Firebase Live Status Card & Selector Guide */}
              <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950 font-['Outfit']">
                        Base de Datos Firebase: <span className="text-[#FF6B2B]">tienda1</span> (Colección: <span className="font-mono text-neutral-800">products</span>)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 text-[10px] font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {dbStatus.tested && dbStatus.success ? `${dbStatus.productsCount ?? products.length} productos en Firestore` : 'Conectada a tienda1'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                      <strong>¿Por qué parece vacía en Firebase Console?</strong> Al entrar a Firebase Console, Google abre por defecto la base de datos <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-bold">(default)</code> que está vacía. Para ver tus productos, haz clic en el selector superior de Firebase y cámbialo a <strong>tienda1</strong>, o usa el enlace directo aquí al lado.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleCheckFirebase}
                    disabled={dbStatus.loading}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold border border-neutral-300 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.loading ? 'animate-spin text-[#FF6B2B]' : 'text-neutral-500'}`} />
                    <span>{dbStatus.loading ? 'Consultando...' : 'Verificar en Vivo'}</span>
                  </button>

                  <a
                    href="https://console.firebase.google.com/project/supple-tree-b9brs/firestore/databases/tienda1/data/~2Fproducts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Abrir en Firebase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Top Bento Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3D8] shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>Total Modelos</span>
                    <Box className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="text-2xl font-black font-['Outfit'] text-[#111111]">
                    {stats.total}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-semibold">En catálogo publicado</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
                  <div className="flex items-center justify-between text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>Con Stock</span>
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black font-['Outfit'] text-emerald-900">
                    {stats.inStockCount}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Listos para entrega inmediata</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-xs">
                  <div className="flex items-center justify-between text-rose-800 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>Sin Stock</span>
                    <PackageX className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-black font-['Outfit'] text-rose-900">
                    {stats.outOfStockCount}
                  </div>
                  <span className="text-[10px] text-rose-700 font-semibold">A fabricar bajo demanda</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between text-amber-800 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>Stock Bajo (≤ 5)</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black font-['Outfit'] text-amber-900">
                    {stats.lowStockCount}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold">Requiere reimpresión</span>
                </div>

                <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-2xl bg-neutral-900 text-white shadow-xs">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>Valor Inventario</span>
                    <DollarSign className="w-4 h-4 text-[#FF6B2B]" />
                  </div>
                  <div className="text-xl font-black font-['Outfit'] text-white">
                    ${stats.totalInventoryValue.toLocaleString('es-AR')}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-semibold">Estimado en piezas físicas</span>
                </div>

              </div>

              {/* Master Stock Control vs. On-Demand WhatsApp Mode Settings */}
              <div className={`p-5 rounded-3xl border transition-all duration-300 ${
                isStockDisabled
                  ? 'bg-gradient-to-r from-emerald-50 via-[#F4FCF7] to-emerald-50/50 border-emerald-300 shadow-sm'
                  : 'bg-[#FAF9F5] border-[#E5E3D8] shadow-xs'
              }`}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isStockDisabled
                        ? 'bg-[#25D366] text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-neutral-100 text-neutral-600 border-[#E5E3D8]'
                    }`}>
                      <WhatsAppIcon className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black font-['Outfit'] text-neutral-900">
                          {isStockDisabled ? 'Modo Pedidos Directos por WhatsApp (Stock Desactivado)' : 'Control de Stock Activo (Inventario Numérico)'}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isStockDisabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {isStockDisabled ? '⚡ Solo Pedir por WhatsApp' : '📦 Control Stock Físico'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                        {isStockDisabled
                          ? 'Los clientes pueden encargar cualquier modelo directamente por WhatsApp sin bloqueos por falta de stock. La producción 3D se realiza bajo demanda.'
                          : 'Los productos muestran cantidades numéricas y se bloquea la venta si el stock llega a 0.'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Toggles and Batch Action */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsStockDisabled(!isStockDisabled)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs active:scale-95 ${
                        isStockDisabled
                          ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                          : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>{isStockDisabled ? 'Reactivar Control de Stock' : 'Desactivar Stock (Solo WhatsApp)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await setAllProductsOnDemand();
                      }}
                      className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center gap-1.5 active:scale-95"
                      title="Establece todos los productos a disponibilidad continua"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Todo a Demanda</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Phone Number Configuration */}
                <div className="mt-4 pt-3.5 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-neutral-800">Número de WhatsApp para recibir pedidos:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs">+</span>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="5491123456789"
                        className="pl-6 pr-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 shadow-xs"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium">(Ej: 54911... país + área + celular)</span>
                  </div>
                </div>
              </div>

              {/* Master Shopping Cart Mode (Activado / Desactivado) */}
              <div className={`p-5 rounded-3xl border transition-all duration-300 ${
                isCartDisabled
                  ? 'bg-gradient-to-r from-orange-50 via-[#FFF9F5] to-amber-50/40 border-orange-300 shadow-sm'
                  : 'bg-[#FAF9F5] border-[#E5E3D8] shadow-xs'
              }`}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isCartDisabled
                        ? 'bg-[#FF6B2B] text-white border-orange-400 shadow-md shadow-[#FF6B2B]/20'
                        : 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    }`}>
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black font-['Outfit'] text-neutral-900">
                          {isCartDisabled 
                            ? 'Carrito de Compras: Desactivado (Modo Catálogo & WhatsApp Directo)' 
                            : 'Carrito de Compras: Activado'}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCartDisabled
                            ? 'bg-[#FF6B2B] text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {isCartDisabled ? '⛔ Carrito Desactivado' : '🛒 Carrito Activo'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                        {isCartDisabled
                          ? 'El carrito está actualmente desactivado. El icono de la cabecera, el cajón lateral y los botones "Agregar al Carrito" están ocultos; los clientes consultan y piden directamente a través de WhatsApp.'
                          : 'El carrito está activo. Los clientes pueden acumular modelos 3D y procesar pedidos consolidados.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsCartDisabled(!isCartDisabled)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer ${
                        isCartDisabled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#FF6B2B] hover:bg-[#E55A1F] text-white'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isCartDisabled ? 'Reactivar Carrito de Compras' : 'Desactivar Carrito de Compras'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white border border-[#E5E3D8] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar por nombre, material, categoría o descripción..."
                    className="w-full pl-10 pr-8 py-2 text-xs font-semibold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B]"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Category Selector */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-700 focus:outline-none focus:border-[#FF6B2B]"
                  >
                    <option value="all">Todas las Categorías</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Stock Filter Selector */}
                  <select
                    value={stockStatusFilter}
                    onChange={(e) => setStockStatusFilter(e.target.value as any)}
                    className="px-3 py-2 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-700 focus:outline-none focus:border-[#FF6B2B]"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="in_stock">Solo Con Stock</option>
                    <option value="out_of_stock">Solo Sin Stock</option>
                    <option value="low_stock">Stock Bajo (≤ 5)</option>
                  </select>

                  {/* Disable All Featured Fast Action */}
                  <button
                    type="button"
                    onClick={() => {
                      disableAllFeatured();
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    title="Desactivar todos los productos destacados"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Desactivar Destacados ({products.filter(p => p.isFeatured).length})</span>
                  </button>

                  <button
                    onClick={handleStartCreate}
                    className="px-4 py-2 rounded-xl bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider hover:bg-[#E55A1F] transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo</span>
                  </button>

                </div>

              </div>

              {/* Hidden file input for table quick photo upload */}
              <input
                ref={tableFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQuickTableFileChanged}
              />

              {/* Products Table & Grid */}
              <div className="bg-white border border-[#E5E3D8] rounded-3xl overflow-hidden shadow-xs">
                
                {filteredProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8F7F2] text-[11px] font-black uppercase tracking-wider text-neutral-600 border-b border-[#EAE7DC]">
                          <th className="py-3 px-4">Producto & Descripción</th>
                          <th className="py-3 px-4">Categoría & Material</th>
                          <th className="py-3 px-4">Precio ($ ARS)</th>
                          <th className="py-3 px-4">Estado & Unidades Stock</th>
                          <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE7DC] text-xs">
                        {filteredProducts.map((p) => {
                          const stockCount = p.stockCount ?? (p.inStock ? 10 : 0);
                          const isLowStock = p.inStock && stockCount > 0 && stockCount <= 5;
                          const isZeroStock = !p.inStock || stockCount === 0;

                          return (
                            <tr key={p.id} className="hover:bg-[#FDFCF7] transition-colors group">
                              
                                {/* Thumbnail & Title + Description */}
                                <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                                  <div className="flex items-start gap-3">
                                    <div className="relative group/thumb shrink-0">
                                      <img
                                        src={p.image}
                                        alt={p.name}
                                        referrerPolicy="no-referrer"
                                        className="w-12 h-12 rounded-xl object-cover border border-[#E5E3D8] bg-neutral-100"
                                      />
                                      {/* Quick Photo Upload Trigger */}
                                      <button
                                        type="button"
                                        onClick={() => handleTriggerQuickUpload(p.id)}
                                        disabled={quickUploadLoadingId === p.id}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white"
                                        title="Cambiar foto y subir a Firebase Storage"
                                      >
                                        {quickUploadLoadingId === p.id ? (
                                          <Loader2 className="w-4 h-4 animate-spin text-[#FF6B2B]" />
                                        ) : (
                                          <Camera className="w-4 h-4" />
                                        )}
                                      </button>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleFeatured(p.id)}
                                          className={`p-1 rounded-lg transition-all shrink-0 ${
                                            p.isFeatured 
                                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                              : 'bg-neutral-100 text-neutral-400 hover:text-neutral-700'
                                          }`}
                                          title={p.isFeatured ? 'Destacado activo (Clic para desactivar)' : 'Marcar como producto destacado'}
                                        >
                                          <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                                        </button>
                                        <span className="font-bold text-[#111111] text-xs sm:text-sm hover:text-[#FF6B2B] transition-colors line-clamp-1">
                                          {p.name}
                                        </span>
                                        {p.isFeatured && (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider">
                                            ⭐ Destacado
                                          </span>
                                        )}
                                        {p.isOffer && (
                                          <span className="px-1.5 py-0.5 rounded bg-[#FF6B2B]/10 text-[#FF6B2B] text-[9px] font-black uppercase">
                                            {p.discountPercent || 10}% OFF
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-medium">
                                        {p.description}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-neutral-400">
                                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-bold">
                                          <Database className="w-2.5 h-2.5 text-[#FF6B2B]" />
                                          <span>Doc:</span>
                                          <span>{p.id}</span>
                                        </span>
                                        <span>•</span>
                                        <span>📏 {p.dimensions}</span>
                                        <span>•</span>
                                        <span>⏱️ {p.printTime}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                              {/* Category & Material */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold text-[10px] uppercase tracking-wider">
                                    {p.categoryLabel}
                                  </span>
                                  <div className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1">
                                    <Layers className="w-3 h-3 text-[#FF6B2B]" />
                                    <span>{p.printMaterial}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Price & Offer */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-black text-sm text-[#111111]">
                                    ${p.price.toLocaleString('es-AR')}
                                  </span>
                                  {p.originalPrice && (
                                    <div className="text-[10px] text-neutral-400 line-through">
                                      ${p.originalPrice.toLocaleString('es-AR')}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Fast Stock Control (Toggle & Numeric Stepper) */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1.5">
                                  
                                  {/* Availability Badge */}
                                  <div className="flex flex-wrap items-center gap-2">
                                    {isStockDisabled || p.onDemandOnly ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#25D366]/20 text-emerald-900 font-black text-[10px] uppercase tracking-wider border border-emerald-300">
                                        <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" /> A Demanda (WhatsApp)
                                      </span>
                                    ) : isZeroStock ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black text-[10px] uppercase">
                                        <PackageX className="w-3 h-3" /> Sin Stock
                                      </span>
                                    ) : isLowStock ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[10px] uppercase">
                                        <AlertTriangle className="w-3 h-3" /> Stock Bajo ({stockCount}u)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                                        <PackageCheck className="w-3 h-3" /> Disponible ({stockCount}u)
                                      </span>
                                    )}

                                    {/* Quick On/Off Switch */}
                                    <button
                                      onClick={() => updateProduct(p.id, { 
                                        onDemandOnly: !p.onDemandOnly,
                                        inStock: true 
                                      })}
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                                        p.onDemandOnly 
                                          ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black'
                                      }`}
                                      title="Alternar entre fabricación bajo demanda y stock numérico fijo"
                                    >
                                      {p.onDemandOnly ? 'Desactivar A Demanda' : '⚡ Activar A Demanda'}
                                    </button>
                                  </div>

                                  {/* Fast Stock Counter Controls */}
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => updateStock(p.id, stockCount - 1 > 0, Math.max(0, stockCount - 1))}
                                      className="w-6 h-6 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                      title="Restar 1 unidad"
                                    >
                                      -
                                    </button>
                                    
                                    <input
                                      type="number"
                                      min={0}
                                      value={stockCount}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        updateStock(p.id, val > 0, isNaN(val) ? 0 : val);
                                      }}
                                      className="w-14 text-center py-0.5 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-md text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                                    />

                                    <button
                                      onClick={() => updateStock(p.id, true, stockCount + 1)}
                                      className="w-6 h-6 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                      title="Sumar 1 unidad"
                                    >
                                      +
                                    </button>
                                    <span className="text-[10px] text-neutral-400 font-semibold">un.</span>
                                  </div>

                                </div>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setQuickViewProduct(p)}
                                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
                                    title="Vista previa cliente"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#FF6B2B] text-white transition-colors flex items-center gap-1 text-[11px] font-black uppercase"
                                    title="Modificar producto y descripción"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Editar</span>
                                  </button>

                                  <button
                                    onClick={() => setProductToDelete(p)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                                    title="Eliminar producto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 mb-1">
                      No hay productos que coincidan con el filtro
                    </h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      Probá ajustando la búsqueda o el filtro de estado de stock.
                    </p>
                    <button
                      onClick={() => {
                        setSearchFilter('');
                        setCategoryFilter('all');
                        setStockStatusFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2 & 3: CREATE & EDIT FORM */}
          {(activeTab === 'create' || activeTab === 'edit') && (
            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-8 space-y-5 bg-white border border-[#E5E3D8] rounded-3xl p-6 shadow-xs">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DC]">
                    <h3 className="text-base font-black font-['Outfit'] text-[#111111] flex items-center gap-2">
                      {activeTab === 'edit' ? <Edit3 className="w-4 h-4 text-[#FF6B2B]" /> : <Plus className="w-4 h-4 text-[#FF6B2B]" />}
                      <span>{activeTab === 'edit' ? 'Modificar Información del Producto' : 'Cargar Nuevo Producto al Catálogo'}</span>
                    </h3>
                    <span className="text-xs font-bold text-neutral-400">
                      Todos los cambios se guardan localmente
                    </span>
                  </div>

                  {/* Product Title / Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                      Nombre del Producto <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Soporte Articulado de Auriculares RGB Gamer"
                      className="w-full px-4 py-2.5 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B]"
                    />

                    {/* Real-time Firebase Document ID preview */}
                    <div className="mt-2 flex items-center justify-between px-3 py-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Database className="w-3.5 h-3.5 text-[#FF6B2B]" />
                        <span className="font-bold text-[11px]">Nombre en Firebase (Document ID):</span>
                        <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-neutral-800 border border-amber-200 text-[11px]">
                          {formData.name 
                            ? formData.name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'producto-3d'
                            : 'nombre-del-producto'}
                        </code>
                      </div>
                      <span className="text-[10px] text-amber-800/80 hidden sm:inline font-semibold">
                        Así se verá en la lista de Firebase
                      </span>
                    </div>
                  </div>

                  {/* Category & Material */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                        Categoría
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const catObj = categories.find(c => c.id === e.target.value) || CATEGORIES.find(c => c.id === e.target.value);
                          setFormData(prev => ({ 
                            ...prev, 
                            category: e.target.value as any,
                            categoryLabel: catObj ? catObj.name : 'General'
                          }));
                        }}
                        className="w-full px-4 py-2.5 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                        Material de Fabricación
                      </label>
                      <select
                        value={formData.printMaterial}
                        onChange={(e) => setFormData(prev => ({ ...prev, printMaterial: e.target.value }))}
                        className="w-full px-4 py-2.5 text-xs font-bold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                      >
                        {PRINT_MATERIALS.map(mat => (
                          <option key={mat} value={mat}>{mat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                      Descripción Corta (Catálogo / Tarjeta) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Resumen conciso con beneficios clave (ej: Soporte plegable con 6 ángulos y ranura para cable)."
                      className="w-full px-4 py-2 text-xs font-medium bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>

                  {/* Long Detailed Description */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-700">
                        Descripción Detallada (Ficha Técnica / Vista Rápida)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.longDescription) return;
                            let formatted = formData.longDescription;
                            const anchors = [
                              'PLAZO DE ENTREGA:',
                              'TIEMPO DE ENTREGA:',
                              'JARRAS PERSONALIZADAS:',
                              'PERSONALIZADOS:',
                              'RECOMENDACIONES EXPLICITAS:',
                              'RECOMENDACIONES:',
                              'CUIDADOS:',
                              'ADVERTENCIA:',
                              'IMPORTANTE:'
                            ];
                            for (const anchor of anchors) {
                              const regex = new RegExp(`([^\\n])\\s*(${anchor})`, 'gi');
                              formatted = formatted.replace(regex, '$1\n\n$2');
                            }
                            formatted = formatted.replace(/([^\n])\s*(\*\*[^*]+(?::|\*\*))/g, '$1\n\n$2');
                            setFormData(prev => ({ ...prev, longDescription: formatted }));
                            addToast('Texto ordenado en renglones limpios', 'info');
                          }}
                          className="text-[10px] font-bold text-[#FF6B2B] hover:text-[#e05316] bg-orange-50 hover:bg-orange-100 border border-orange-200/60 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Separa el texto automáticamente en renglones organizados"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Ordenar Renglones</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const template = `${formData.name ? formData.name.toUpperCase() + ' - ' : ''}DISEÑO EXCLUSIVO IMPRESO EN 3D DE ALTA DEFINICIÓN.\n\nPLAZO DE ENTREGA: De 24 a 48 hs una vez aprobada la compra.\n\nJARRAS PERSONALIZADAS: Demora de 48 a 72 hs desde aprobada la compra.\n\n**Para pedidos personalizados en más de 5 unidades consultar plazo de entrega.**\n\nRECOMENDACIONES EXPLICITAS: No exponer al calor, ni al fuego, ni a altas temperaturas. No rellenar con líquidos calientes.`;
                            setFormData(prev => ({ ...prev, longDescription: template }));
                            addToast('Plantilla ordenada insertada', 'success');
                          }}
                          className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Inserta plantilla ordenada con renglones para entrega y cuidados"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Plantilla</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      value={formData.longDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                      placeholder="Detalles sobre relleno, acabado, resistencia térmica, encastres o compatibilidad..."
                      className="w-full px-4 py-2.5 text-xs font-medium bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B] leading-relaxed"
                    />
                    <p className="text-[10px] text-neutral-400 font-medium mt-1">
                      💡 Consejo: Cada salto de línea (Enter) se mostrará ordenadamente en la vista del producto con renglones bien estructurados y destacados.
                    </p>

                    {/* Live preview in admin */}
                    {formData.longDescription && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#E5E3D8] shadow-xs">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1.5">
                          Vista Previa de Renglones en Tienda:
                        </span>
                        <ProductDescription description={formData.longDescription} />
                      </div>
                    )}
                  </div>

                  {/* Price & Offer Configuration */}
                  <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
                      💰 Precios & Promociones
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                          Precio de Venta ($ ARS) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={100}
                          step={100}
                          required
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-3 py-2 text-xs font-black bg-white border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                          Precio Original / Tachado ($)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={formData.originalPrice || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
                          placeholder="Opcional"
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                        />
                      </div>

                      <div className="flex items-center pt-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isOffer}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOffer: e.target.checked }))}
                            className="w-4 h-4 rounded text-[#FF6B2B] focus:ring-[#FF6B2B] accent-[#FF6B2B]"
                          />
                          <span className="text-xs font-bold text-neutral-800">
                            Marcar como Oferta 🔥
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Stock & Manufacturing Specs */}
                  <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
                      📦 Control de Stock Físico & Taller
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                          Unidades Físicas en Stock
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={formData.stockCount}
                          onChange={(e) => {
                            const count = parseInt(e.target.value, 10) || 0;
                            setFormData(prev => ({ 
                              ...prev, 
                              stockCount: count,
                              inStock: count > 0 
                            }));
                          }}
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                          Dimensiones
                        </label>
                        <input
                          type="text"
                          value={formData.dimensions}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="Ej: 15 x 8 x 4 cm"
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">
                          Tiempo de Impresión
                        </label>
                        <input
                          type="text"
                          value={formData.printTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, printTime: e.target.value }))}
                          placeholder="Ej: 3 hs 45 min"
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Mode / On Demand Toggle */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="on-demand-toggle"
                        checked={formData.onDemandOnly || false}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          onDemandOnly: e.target.checked,
                          inStock: e.target.checked ? true : prev.inStock
                        }))}
                        className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <label htmlFor="on-demand-toggle" className="cursor-pointer">
                        <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                          Fabricación a Demanda (Solo Pedir por WhatsApp)
                        </span>
                        <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Desactiva el límite de stock numérico para este producto. Los clientes podrán solicitarlo directamente por WhatsApp con el botón personalizado.
                        </p>
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                        />
                        <span className="font-bold text-neutral-800">
                          Disponible para encargar
                        </span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-4 h-4 rounded text-[#FF6B2B] focus:ring-[#FF6B2B] accent-[#FF6B2B]"
                        />
                        <span className="font-bold text-neutral-800">
                          Destacar en Portada ⭐
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Colors Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-2">
                      Colores de Filamento Disponibles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map(color => {
                        const isSelected = formData.colors.some(c => c.name === color.name);
                        return (
                          <button
                            type="button"
                            key={color.name}
                            onClick={() => handleToggleColor(color)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-neutral-900 text-white shadow-xs border border-neutral-900'
                                : 'bg-[#F9F9F8] text-neutral-600 border border-[#E5E3D8] hover:border-neutral-400'
                            }`}
                          >
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-[#FF6B2B]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                      Etiquetas / Tags de Búsqueda
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Escribí una etiqueta y presioná Enter o Agregar..."
                        className="flex-1 px-4 py-2 text-xs font-semibold bg-[#F9F9F8] border border-[#E5E3D8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-black uppercase hover:bg-neutral-800 transition-colors"
                      >
                        Agregar Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {formData.tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold">
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-neutral-400 hover:text-rose-600 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Image Selection & Live Preview */}
                <div className="lg:col-span-4 space-y-5">
                  
                  {/* Image Picker with Firebase Storage, URL and Presets */}
                  <div className="bg-white border border-[#E5E3D8] rounded-3xl p-5 shadow-xs space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#FF6B2B]" />
                          <span>Galería de Fotos (Hasta 3 Fotos)</span>
                        </h4>
                        <span className="text-[10px] font-bold text-[#FF6B2B] bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full border border-[#FF6B2B]/20">
                          Foto #{activePhotoSlot + 1} seleccionada
                        </span>
                      </div>

                      {/* DOBLE OPCIÓN: BOTONES SELECTORES DESTACADOS */}
                      <div className="bg-[#FAF9F5] p-2.5 rounded-2xl border border-[#E5E3D8] space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-black text-neutral-900">
                            <span>Doble Opción (Archivo local o Enlace directo):</span>
                          </div>
                          <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                            Podés subir fotos directamente desde tu celular/PC, o pegar un enlace web de imagen (https://...) si preferís usar fotos alojadas en la web.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setImageSourceTab('upload')}
                            className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              imageSourceTab === 'upload'
                                ? 'bg-[#111111] text-white border-neutral-900 shadow-md ring-2 ring-[#FF6B2B]/40'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:text-black'
                            }`}
                          >
                            <Smartphone className="w-4 h-4 text-[#FF6B2B]" />
                            <span className="truncate">1. Celular / PC</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setImageSourceTab('url')}
                            className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              imageSourceTab === 'url'
                                ? 'bg-[#111111] text-white border-neutral-900 shadow-md ring-2 ring-[#FF6B2B]/40'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:text-black'
                            }`}
                          >
                            <Link2 className="w-4 h-4 text-[#FF6B2B]" />
                            <span className="truncate">2. Enlace Web (URL)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3 PHOTO SLOTS SELECTOR */}
                    <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-[#E5E3D8] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                          Seleccionar Foto a Editar o Eliminar:
                        </span>
                        <span className="text-[10px] font-bold text-[#FF6B2B]">
                          Slot {activePhotoSlot + 1}: {['Foto 1 (Principal)', 'Foto 2 (Detalle)', 'Foto 3 (Perspectiva)'][activePhotoSlot]}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((slotIdx) => {
                          const slotImg = slotIdx === 0 
                            ? formData.image 
                            : (formData.additionalImages && formData.additionalImages[slotIdx - 1]) || '';
                          const isSlotActive = activePhotoSlot === slotIdx;
                          const slotLabel = ['Foto 1 (Portada)', 'Foto 2 (Detalle)', 'Foto 3 (Ángulo)'][slotIdx];

                          return (
                            <div
                              key={slotIdx}
                              onClick={() => setActivePhotoSlot(slotIdx as 0 | 1 | 2)}
                              className={`relative p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center group/slot ${
                                isSlotActive
                                  ? 'border-[#FF6B2B] bg-[#FFF5EE] ring-2 ring-[#FF6B2B]/40 shadow-xs'
                                  : 'border-[#E5E3D8] bg-white hover:border-neutral-400'
                              }`}
                            >
                              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                                {slotImg ? (
                                  <>
                                    <img src={slotImg} alt="" className="w-full h-full object-cover" />
                                    {/* Action to delete photo (available on ALL slots including Slot 1 Principal) */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSlotPhoto(slotIdx);
                                      }}
                                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm z-10"
                                      title={slotIdx === 0 ? "Eliminar Foto 1 (Principal)" : `Eliminar Foto ${slotIdx + 1}`}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>

                                    {/* Action to promote Slot 2 or 3 to Primary */}
                                    {slotIdx > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMakePrimary(slotIdx);
                                        }}
                                        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/75 hover:bg-amber-500 text-white flex items-center justify-center transition-colors shadow-sm z-10"
                                        title="Establecer esta foto como Foto Principal (Portada)"
                                      >
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-center p-1">
                                    <ImagePlus className="w-4 h-4 text-neutral-400 mx-auto mb-0.5" />
                                    <span className="text-[8px] font-bold text-neutral-400 block">Vacío</span>
                                  </div>
                                )}
                                <span className="absolute bottom-1 left-1 text-[8px] font-black px-1 rounded bg-black/70 text-white">
                                  #{slotIdx + 1}
                                </span>
                              </div>
                              <span className={`text-[9px] font-bold mt-1 line-clamp-1 ${isSlotActive ? 'text-[#FF6B2B]' : 'text-neutral-600'}`}>
                                {slotLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Active Slot Quick Controls Bar */}
                      {(() => {
                        const currentSlotImg = activePhotoSlot === 0 
                          ? formData.image 
                          : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]) || '';

                        return (
                          <div className="pt-2 border-t border-[#E5E3D8] flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {activePhotoSlot === 0 ? (
                                <span className="font-black text-[#111111] flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                                  ⭐ Foto Principal (Portada)
                                </span>
                              ) : (
                                <span className="font-bold text-neutral-600">
                                  Foto #{activePhotoSlot + 1}
                                </span>
                              )}
                              {currentSlotImg ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Asignada
                                </span>
                              ) : (
                                <span className="text-neutral-400 font-semibold italic">
                                  Sin foto aún
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {currentSlotImg && activePhotoSlot > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMakePrimary(activePhotoSlot)}
                                  className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                                  title="Establecer esta foto como la principal del producto"
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Hacer Principal</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-[#FF6B2B] text-white text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                                title="Subir o reemplazar foto desde tu celular o computadora"
                              >
                                <Camera className="w-3 h-3" />
                                <span>{currentSlotImg ? 'Cambiar Foto' : 'Subir Foto'}</span>
                              </button>

                              {currentSlotImg && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlotPhoto(activePhotoSlot)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  title={activePhotoSlot === 0 ? "Eliminar la foto principal" : "Eliminar esta foto"}
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                  <span>{activePhotoSlot === 0 ? 'Eliminar Principal' : 'Eliminar'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Hidden input for local file selection */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImageFile(file);
                      }}
                    />

                    {/* TAB 1: SUBIR A FIREBASE STORAGE */}
                    {imageSourceTab === 'upload' && (
                      <div className="space-y-3">
                        {/* Drag & Drop Dropzone */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDropFile}
                          onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                            isDraggingFile
                              ? 'border-[#FF6B2B] bg-[#FFF5EE] scale-[1.01]'
                              : isUploadingImage
                              ? 'border-orange-300 bg-orange-50/50 cursor-wait'
                              : 'border-[#D9D6C8] hover:border-[#FF6B2B] bg-[#FAFAF8] hover:bg-[#FFFDFB]'
                          }`}
                        >
                          {isUploadingImage ? (
                            <div className="space-y-3 py-2">
                              <div className="w-10 h-10 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mx-auto animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-neutral-800">
                                  {uploadStatusText || `Subiendo Foto ${activePhotoSlot + 1} a Firebase Storage...`}
                                </p>
                                {uploadedFileInfo && (
                                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                                    {uploadedFileInfo.name} ({uploadedFileInfo.size})
                                  </p>
                                )}
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                                <div
                                  className="bg-[#FF6B2B] h-full transition-all duration-300 rounded-full"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-[#FF6B2B] tracking-wider">
                                {uploadProgress}% COMPLETADO
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-[#FF6B2B] flex items-center justify-center mx-auto border border-[#E5E3D8] group-hover:scale-105 transition-transform">
                                <CloudUpload className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-neutral-800">
                                  Subir Foto {activePhotoSlot + 1} ({['Principal', 'Detalle', 'Perspectiva'][activePhotoSlot]})
                                </p>
                                <p className="text-[10px] text-neutral-500 font-medium">
                                  Hacé clic o arrastrá el archivo para guardarlo en Firebase Storage
                                </p>
                              </div>
                              <div className="pt-1">
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors shadow-xs">
                                  <ImagePlus className="w-3 h-3" />
                                  <span>Seleccionar para Foto {activePhotoSlot + 1}</span>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Error feedback */}
                        {uploadError && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                            <span className="text-[11px] leading-snug">{uploadError}</span>
                          </div>
                        )}

                        {/* Current Image Details & Storage URL Link for active slot */}
                        {(() => {
                          const currentSlotImage = activePhotoSlot === 0 
                            ? formData.image 
                            : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]) || '';

                          if (!currentSlotImage) return null;

                          return (
                            <div className="p-3 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-neutral-500 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>URL de Foto {activePhotoSlot + 1} Asignada</span>
                                </span>
                                {currentSlotImage.includes('firebasestorage.googleapis.com') && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                                    Firebase Storage
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={currentSlotImage}
                                  className="flex-1 px-2.5 py-1.5 text-[10px] font-mono bg-white border border-[#E5E3D8] rounded-lg text-neutral-700 select-all"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(currentSlotImage);
                                    addToast('URL copiada al portapapeles', 'info');
                                  }}
                                  className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition-colors"
                                  title="Copiar URL"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={currentSlotImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition-colors"
                                  title="Abrir imagen en pestaña nueva"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlotPhoto(activePhotoSlot)}
                                  className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors text-[10px] font-bold flex items-center gap-1"
                                  title={activePhotoSlot === 0 ? "Eliminar Foto 1 (Principal)" : "Eliminar esta foto"}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Eliminar</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TAB 2: URL PERSONALIZADA (ENLACE DIRECTO) */}
                    {imageSourceTab === 'url' && (
                      <div className="space-y-3 p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E5E3D8]">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black uppercase text-neutral-800 flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5 text-[#FF6B2B]" />
                            <span>Enlace Web para Foto {activePhotoSlot + 1}</span>
                          </label>
                          <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF6B2B]/10 text-[#FF6B2B]">
                            {activePhotoSlot === 0 ? 'Portada' : `Foto #${activePhotoSlot + 1}`}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="url"
                              value={
                                activePhotoSlot === 0
                                  ? formData.image
                                  : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]) || ''
                              }
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                if (activePhotoSlot === 0) {
                                  setFormData(prev => ({ ...prev, image: val }));
                                } else {
                                  const targetIdx = activePhotoSlot - 1;
                                  setFormData(prev => {
                                    const list = [...(prev.additionalImages || [])];
                                    list[targetIdx] = val;
                                    return { ...prev, additionalImages: list };
                                  });
                                }
                              }}
                              placeholder="https://ejemplo.com/tu-foto.jpg (o Unsplash, Imgur, etc.)"
                              className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-[#D9D6C8] rounded-xl text-neutral-900 focus:outline-none focus:border-[#FF6B2B] focus:ring-1 focus:ring-[#FF6B2B]"
                            />

                            {/* Paste from Clipboard button */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const text = await navigator.clipboard.readText();
                                  if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
                                    if (activePhotoSlot === 0) {
                                      setFormData(prev => ({ ...prev, image: text.trim() }));
                                    } else {
                                      const targetIdx = activePhotoSlot - 1;
                                      setFormData(prev => {
                                        const list = [...(prev.additionalImages || [])];
                                        list[targetIdx] = text.trim();
                                        return { ...prev, additionalImages: list };
                                      });
                                    }
                                    addToast('Enlace pegado desde el portapapeles', 'info');
                                  } else {
                                    addToast('El portapapeles no contiene un enlace http/https', 'warning');
                                  }
                                } catch {
                                  addToast('Podés pegar con Ctrl+V o manteniendo presionado en el campo de texto', 'info');
                                }
                              }}
                              className="px-2.5 py-2 bg-white hover:bg-neutral-100 border border-[#D9D6C8] rounded-xl text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Pegar enlace del portapapeles"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#FF6B2B]" />
                              <span className="hidden sm:inline">Pegar</span>
                            </button>
                          </div>

                          {/* Quick Actions & Sync */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            {formData.id && activeTab === 'edit' && (
                              <button
                                type="button"
                                onClick={async () => {
                                  const currentVal = activePhotoSlot === 0
                                    ? formData.image
                                    : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]) || '';
                                  if (!currentVal) {
                                    addToast('Primero ingresá o pegá un enlace válido', 'warning');
                                    return;
                                  }
                                  const payload = activePhotoSlot === 0
                                    ? { image: currentVal }
                                    : {
                                        additionalImages: (() => {
                                          const list = [...(formData.additionalImages || [])];
                                          list[activePhotoSlot - 1] = currentVal;
                                          return list;
                                        })()
                                      };
                                  const res = await updateProductInFirestore(formData.id, payload);
                                  if (res.success) {
                                    updateProduct(formData.id, payload);
                                    addToast('¡Enlace web guardado en Firebase Firestore!', 'success');
                                  } else {
                                    addToast(`Aviso: ${res.error || 'Error al guardar'}`, 'warning');
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Guardar enlace en Firebase</span>
                              </button>
                            )}

                            {((activePhotoSlot === 0 ? formData.image : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]))) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSlotPhoto(activePhotoSlot)}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Eliminar foto</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5 bg-neutral-100/70 border border-neutral-200 rounded-xl text-[10px] text-neutral-600 leading-relaxed">
                          🌐 <strong>Compatible con:</strong> Enlaces directos de <strong>Imgur</strong>, <strong>Unsplash</strong>, <strong>Postimages.org</strong>, <strong>Google Drive</strong> o cualquier servidor web HTTPS.
                        </div>
                      </div>
                    )}

                    {/* TAB 3: GALERÍA PREDEFINIDA DEL TALLER */}
                    {imageSourceTab === 'presets' && (
                      <div>
                        <span className="block text-[10px] font-black uppercase text-neutral-500 mb-2">
                          Asignar a Foto {activePhotoSlot + 1} desde fotos del taller:
                        </span>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_IMAGES.map((preset, idx) => {
                            const currentSlotImg = activePhotoSlot === 0
                              ? formData.image
                              : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1]) || '';
                            const isSelected = currentSlotImg === preset.url;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => {
                                  if (activePhotoSlot === 0) {
                                    setFormData(prev => ({ ...prev, image: preset.url }));
                                  } else {
                                    const targetIdx = activePhotoSlot - 1;
                                    setFormData(prev => {
                                      const list = [...(prev.additionalImages || [])];
                                      list[targetIdx] = preset.url;
                                      return { ...prev, additionalImages: list };
                                    });
                                  }
                                  addToast(`Foto ${activePhotoSlot + 1} actualizada con foto del taller`, 'success');
                                }}
                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                                  isSelected ? 'border-[#FF6B2B] ring-2 ring-[#FF6B2B]/20' : 'border-transparent hover:border-neutral-300'
                                }`}
                                title={preset.label}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#FF6B2B]/30 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white drop-shadow" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                    {/* Live Card Preview */}
                    <div className="bg-white border border-[#E5E3D8] rounded-3xl p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 block">
                          👁️ Vista Previa en Tienda
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400">
                          {1 + (formData.additionalImages?.filter(Boolean).length || 0)} de 3 fotos cargadas
                        </span>
                      </div>

                      <div className="border border-[#E5E3D8] rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="relative h-44 bg-neutral-900">
                          <img
                            src={
                              (activePhotoSlot === 0
                                ? formData.image
                                : (formData.additionalImages && formData.additionalImages[activePhotoSlot - 1])) ||
                              formData.image ||
                              PRESET_IMAGES[0].url
                            }
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {formData.isOffer && (
                            <span className="absolute top-3 left-3 bg-[#FF6B2B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                              10% OFF
                            </span>
                          )}
                          {!formData.inStock && (
                            <span className="absolute top-3 right-3 bg-neutral-900/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                              Bajo Demanda
                            </span>
                          )}
                        </div>

                        {/* Thumbnail strip */}
                        <div className="flex items-center gap-1.5 p-2 bg-[#FAF9F5] border-b border-[#EAE7DC]">
                          {[
                            formData.image,
                            ...(formData.additionalImages || [])
                          ].filter(Boolean).map((imgUrl, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-lg overflow-hidden border border-[#D9D6C8] bg-neutral-100 shrink-0"
                            >
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="text-[10px] font-black uppercase text-[#FF6B2B]">
                            {formData.categoryLabel} • {formData.printMaterial}
                          </div>
                          <h5 className="font-black text-xs text-neutral-900 line-clamp-1 font-['Outfit']">
                            {formData.name || 'Título de producto de muestra'}
                          </h5>
                          <p className="text-[11px] text-neutral-500 line-clamp-2">
                            {formData.description || 'Descripción resumida para el catálogo principal.'}
                          </p>

                          <div className="pt-2 flex items-center justify-between border-t border-[#EAE7DC]">
                            <div>
                              <span className="font-black text-sm text-[#111111]">
                                ${formData.price.toLocaleString('es-AR')}
                              </span>
                              {formData.originalPrice && (
                                <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                                  ${formData.originalPrice.toLocaleString('es-AR')}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400">
                              {formData.stockCount} un. disp.
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                </div>

              </div>

              {/* Save Product Error Notice */}
              {saveProductError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-medium">Error al guardar en Firebase tienda1: {saveProductError}</span>
                </div>
              )}

              {/* Form Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EAE7DC]">
                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => {
                    setActiveTab('inventory');
                    setAdminEditProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSavingProduct || isUploadingImage}
                    className="px-6 py-3 rounded-2xl bg-[#FF6B2B] hover:bg-[#E55A1F] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-98"
                  >
                    {isSavingProduct ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando en Firebase (tienda1)...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{activeTab === 'edit' ? 'Guardar Cambios en Firebase' : 'Guardar y Publicar en Firebase'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB 4: CATEGORIES & COVERS MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              {/* Category Management Header Strip */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5E3D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-1 bg-[#FF6B2B]/10 px-2.5 py-0.5 rounded-full">
                    <Layers className="w-3 h-3 text-[#FF6B2B]" />
                    <span>Sección "Explorá nuestras categorías"</span>
                  </div>
                  <h3 className="text-xl font-black font-['Outfit'] text-neutral-900">
                    Administrador de Portadas & Categorías ({categories.length})
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xl font-medium mt-0.5">
                    Modificá las fotos de portada, creá nuevas categorías personalizadas o editá títulos y descripciones. Se sincroniza con Firebase en tiempo real.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setCategoryToEditInAdmin(null);
                      setIsAddingNewCategory(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF6B2B] text-white hover:bg-[#e05316] transition-all flex items-center gap-1.5 shadow-md shadow-[#FF6B2B]/20 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Nueva Categoría</span>
                  </button>

                  <button
                    onClick={async () => {
                      setIsSyncingCategories(true);
                      await syncAllCategoriesToFirestore();
                      setIsSyncingCategories(false);
                    }}
                    disabled={isSyncingCategories}
                    className="text-xs font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    title="Sincroniza las portadas y categorías en la base de datos Firebase tienda1"
                  >
                    {isSyncingCategories ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    ) : (
                      <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{isSyncingCategories ? 'Sincronizando...' : 'Guardar en Firebase'}</span>
                  </button>

                  <button
                    onClick={() => resetCategoriesToDefault()}
                    className="text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-xl border border-neutral-200 transition-all flex items-center gap-1.5"
                    title="Restablece las portadas a las fotos originales recomendadas de fábrica"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Restablecer Fábrica</span>
                  </button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => {
                  const productCount = products.filter(p => p.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white rounded-3xl border border-[#E5E3D8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Image Thumbnail */}
                      <div 
                        onClick={() => {
                          setIsAddingNewCategory(false);
                          setCategoryToEditInAdmin(cat);
                        }}
                        className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden group cursor-pointer"
                        title={`Hacé clic para editar la categoría "${cat.name}"`}
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="bg-white/95 text-neutral-900 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-[#FF6B2B]" />
                            Editar Categoría
                          </span>
                        </div>
                        
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-black text-neutral-900 flex items-center gap-1.5 shadow-sm">
                          <Tag className="w-3 h-3 text-[#FF6B2B]" />
                          <span>ID: {cat.id}</span>
                        </div>

                        {/* Top-Right Quick Action Buttons on Category Card */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryToDelete(cat);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white backdrop-blur-md transition-all text-[11px] font-bold flex items-center gap-1 shadow-md hover:scale-105 active:scale-95"
                            title={`Eliminar categoría ${cat.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                          <h4 className="text-base font-black font-['Outfit'] leading-tight">
                            {cat.name}
                          </h4>
                          <span className="text-[11px] text-neutral-300 font-medium">
                            {productCount} {productCount === 1 ? 'producto asociado' : 'productos asociados'}
                          </span>
                        </div>
                      </div>

                      {/* Content & Actions */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs text-neutral-600 font-medium line-clamp-2 leading-relaxed">
                          {cat.description || 'Sin descripción'}
                        </p>

                        <div className="pt-2 border-t border-[#EAE7DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryFilter(cat.id);
                                setActiveTab('inventory');
                              }}
                              className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 hover:underline"
                            >
                              <span>Ver {productCount}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartCreate(cat.id)}
                              className="text-[11px] font-black text-[#FF6B2B] hover:text-[#e05316] bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-[#FF6B2B]/20 transition-colors flex items-center gap-1"
                              title={`Crear un producto directamente dentro de ${cat.name}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Producto</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryToDelete(cat);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-all text-xs font-bold flex items-center gap-1 shadow-xs"
                              title={`Eliminar categoría ${cat.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingNewCategory(false);
                                setCategoryToEditInAdmin(cat);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                              title={`Editar nombre, foto, ícono y detalles de ${cat.name}`}
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#FF6B2B] group-hover:text-white" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Category Card Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setCategoryToEditInAdmin(null);
                    setIsAddingNewCategory(true);
                  }}
                  className="rounded-3xl border-2 border-dashed border-[#D9D6C8] hover:border-[#FF6B2B] bg-[#FAFAF8] hover:bg-[#FFF8F4] p-8 flex flex-col items-center justify-center text-center transition-all group min-h-[260px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E3D8] group-hover:border-[#FF6B2B]/30 flex items-center justify-center text-[#FF6B2B] mb-3 group-hover:scale-110 shadow-xs transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black font-['Outfit'] text-neutral-900 mb-1 group-hover:text-[#FF6B2B] transition-colors">
                    + Agregar Nueva Categoría
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-xs font-medium">
                    Creá un nuevo rubro con su propia foto de portada, ícono, nombre y descripción para tu catálogo.
                  </p>
                </button>

              </div>

            </div>
          )}

        </div>
        </>
      )}

      </motion.div>

      {/* Category Edit Modal from Admin */}
      <CategoryEditModal
        category={categoryToEditInAdmin}
        isNew={isAddingNewCategory}
        isOpen={Boolean(categoryToEditInAdmin) || isAddingNewCategory}
        onClose={() => {
          setCategoryToEditInAdmin(null);
          setIsAddingNewCategory(false);
        }}
      />

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryToDelete(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-neutral-900 leading-tight">
                    ¿Eliminar esta categoría?
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Categoría: <strong className="text-neutral-900">{categoryToDelete.name}</strong> (ID: {categoryToDelete.id})
                  </p>
                </div>
              </div>

              {/* Category card preview */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <img
                  src={categoryToDelete.image}
                  alt={categoryToDelete.name}
                  className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-neutral-900 truncate">{categoryToDelete.name}</p>
                  <p className="text-xs text-neutral-500 line-clamp-1">{categoryToDelete.description || 'Sin descripción'}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {products.filter(p => p.category === categoryToDelete.id).length} producto(s) asignado(s)
                  </p>
                </div>
              </div>

              {products.filter(p => p.category === categoryToDelete.id).length > 0 && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-950">Aviso sobre productos asociados:</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Esta categoría tiene {products.filter(p => p.category === categoryToDelete.id).length} producto(s). Los productos no se borrarán; seguirán existiendo en tu catálogo y podrás reasignarlos a otra categoría cuando quieras.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-neutral-600">
                Esta acción eliminará la categoría del menú de la tienda y de la base de datos de Firebase.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const catId = categoryToDelete.id;
                    setCategoryToDelete(null);
                    deleteCategory(catId);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sí, Eliminar Definitivamente</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE SUPERVISOR PASSWORD MODAL */}
      <AnimatePresence>
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChangePasswordModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-[#E5E3D8] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EAE7DC] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B2B] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-['Outfit'] text-neutral-900">
                      Cambiar Contraseña de Supervisor
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Actualizá la clave de acceso al panel de stock
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Contraseña actual (ej: thunder3d)"
                    className="w-full bg-[#FAFAF8] border border-[#E5E3D8] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF6B2B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full bg-[#FAFAF8] border border-[#E5E3D8] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF6B2B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Repetí la nueva contraseña"
                    className="w-full bg-[#FAFAF8] border border-[#E5E3D8] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF6B2B]"
                    required
                  />
                </div>

                {changePassError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{changePassError}</span>
                  </div>
                )}

                {changePassSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{changePassSuccess}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Guardar Clave
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-[#E5E3D8] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black font-['Outfit'] text-neutral-900">
                  ¿Eliminar este producto?
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                  Estás a punto de borrar <strong className="text-neutral-800">"{productToDelete.name}"</strong> del catálogo y del inventario.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                >
                  Sí, Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESET TO FACTORY CONFIRMATION */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-[#E5E3D8] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black font-['Outfit'] text-neutral-900">
                  ¿Restablecer catálogo a fábrica?
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                  Esto repondrá todos los productos iniciales y restaurará los valores de stock predeterminados.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    resetProductsToDefault();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                >
                  Restablecer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
