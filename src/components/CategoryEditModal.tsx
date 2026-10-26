import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  RotateCcw, 
  Check, 
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  ArrowUpRight,
  Plus,
  Tag,
  Coffee,
  Palette,
  Cookie,
  Flame,
  Wine,
  Wrench,
  Gift,
  Zap,
  Shield,
  Heart,
  Star,
  Box,
  Compass,
  Trash2,
  Edit3,
  Trophy,
  Smartphone,
  Link2,
  Clipboard,
  ExternalLink,
  CloudUpload,
  CheckCircle
} from 'lucide-react';
import { Category } from '../types';
import { useCart } from '../context/CartContext';
import { uploadProductImageToFirebaseStorage, compressAndOptimizeImage } from '../services/storage';

interface CategoryEditModalProps {
  category: Category | null;
  isOpen: boolean;
  isNew?: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'Destacado' },
  { name: 'Coffee', icon: Coffee, label: 'Jarras / Mate' },
  { name: 'Palette', icon: Palette, label: 'Arte / Cerámica' },
  { name: 'Cookie', icon: Cookie, label: 'Cortantes / Repostería' },
  { name: 'Flame', icon: Flame, label: 'Fuego / Populares' },
  { name: 'Wine', icon: Wine, label: 'Botellas / Copas' },
  { name: 'Wrench', icon: Wrench, label: 'Personalizados / Taller' },
  { name: 'Tag', icon: Tag, label: 'Llaveros / Souvenirs' },
  { name: 'Gift', icon: Gift, label: 'Regalos' },
  { name: 'Zap', icon: Zap, label: 'Especial' },
  { name: 'Shield', icon: Shield, label: 'Vikingos / Anime' },
  { name: 'Heart', icon: Heart, label: 'Favoritos' },
  { name: 'Star', icon: Star, label: 'Estrellas' },
  { name: 'Box', icon: Box, label: 'Modelos 3D' },
  { name: 'Trophy', icon: Trophy, label: 'Deportes' }
];

// Curated high quality presets for popular categories
const CATEGORY_PRESET_IMAGES: Record<string, { label: string; url: string }[]> = {
  jarras: [
    { label: 'Chopp Vikingo Calavera 3D', url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jarra Medieval Barril', url: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jarra Gamer y Cerveza', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80' },
    { label: 'Chopp con Relieve Nórdico', url: 'https://images.unsplash.com/photo-1608270546103-9799446d3ef2?auto=format&fit=crop&w=800&q=80' }
  ],
  ceramica: [
    { label: 'Herramientas de Cerámica y Arcilla', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80' },
    { label: 'Taller de Alfarería y Modelado', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' },
    { label: 'Texturas y Sellos Cerámicos', url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Piezas Artesanales de Arcilla', url: 'https://images.unsplash.com/photo-1590483256033-918933e1ee35?auto=format&fit=crop&w=800&q=80' }
  ],
  cortantes: [
    { label: 'Cortantes de Galletitas y Repostería', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Moldes Dulces y Fondant', url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Masa y Formas de Galleta', url: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cookie Cutters Creativos', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' }
  ],
  mate: [
    { label: 'Mate Tradicional Térmico 3D', url: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mate con Bombilla y Yerba', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mate Imperial Grabado', url: 'https://images.unsplash.com/photo-1627993077366-d3a39e8dc979?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mate de Madera y Polímero', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' }
  ],
  llaveros: [
    { label: 'Llaveros y Figuras Articuladas 3D', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { label: 'Souvenirs y Piezas de Colección', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Impresión 3D Miniaturas de Precisión', url: 'https://images.unsplash.com/photo-1633493763347-1959328eb970?auto=format&fit=crop&w=800&q=80' },
    { label: 'Llaveros Geométricos y Colores', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80' }
  ],
  'botellas-cortadas': [
    { label: 'Vasos de Botellas Recicladas', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cristalería y Vidrio Artesanal', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Macetas y Faroles de Botellas', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' },
    { label: 'Vasos Pulidos al Fuego', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' }
  ],
  personalizados: [
    { label: 'Taller de Prototipado y Fabricación 3D', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { label: 'Diseño Industrial y Piezas a Medida', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80' },
    { label: 'Extrusión e Impresoras 3D en Acción', url: 'https://images.unsplash.com/photo-1633493763347-1959328eb970?auto=format&fit=crop&w=800&q=80' },
    { label: 'Modelos CAD e Ingeniería 3D', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' }
  ],
  general: [
    { label: 'Impresión 3D Creativa', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lámparas y Decoración Nórdica', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Figuras Coleccionables y Anime', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Macetas Geométricas y Plantas', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80' }
  ]
};

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  category,
  isOpen,
  isNew = false,
  onClose
}) => {
  const { addCategory, updateCategory, deleteCategory, products, addToast } = useCart();
  
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCustomId, setIsCustomId] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [photoTab, setPhotoTab] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setShowConfirmDelete(false);
    if (category && !isNew) {
      setId(category.id);
      setName(category.name);
      setDescription(category.description);
      setImageUrl(category.image);
      setIconName(category.iconName || 'Sparkles');
      setIsCustomId(true);
    } else if (isNew) {
      setId('');
      setName('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
      setIconName('Sparkles');
      setIsCustomId(false);
    }
  }, [category, isNew, isOpen]);

  // Auto generate ID slug when typing name in new mode
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (isNew && !isCustomId) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setId(generatedSlug);
    }
  };

  if (!isOpen) return null;

  const currentCount = category ? products.filter(p => p.category === category.id).length : 0;
  const presets = category ? (CATEGORY_PRESET_IMAGES[category.id] || CATEGORY_PRESET_IMAGES.general) : CATEGORY_PRESET_IMAGES.general;

  const SelectedIconComp = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon || Sparkles;

  const processCategoryFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP)', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // 1. Instant client-side compression to lightweight WebP data URL (< 30 KB)
      const { dataUrl: instantDataUrl } = await compressAndOptimizeImage(file, 720, 720, 0.75);
      setImageUrl(instantDataUrl);

      // 2. Upload to storage if available
      const targetSlug = id || `category_${Date.now()}`;
      const uploadedUrl = await uploadProductImageToFirebaseStorage(
        file,
        `category_${targetSlug}`,
        (prog) => setUploadProgress(prog)
      );
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      }
      addToast('¡Foto de portada procesada y lista!', 'success');
    } catch (err) {
      console.warn('Error processing category image:', err);
      addToast('Error al procesar la imagen.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCategoryFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processCategoryFile(file);
    }
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        setImageUrl(text.trim());
        addToast('¡Enlace web pegado correctamente!', 'success');
      } else {
        addToast('El portapapeles no contiene un enlace de imagen válido (https://...)', 'warning');
      }
    } catch {
      addToast('Por favor pegá el enlace directamente en el campo de texto', 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    const finalId = id.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

    if (isNew) {
      addCategory({
        id: finalId,
        name: name.trim(),
        description: description.trim(),
        image: finalImage,
        iconName: iconName || 'Sparkles',
        count: 0
      });
    } else if (category) {
      updateCategory(category.id, {
        name: name.trim(),
        description: description.trim(),
        image: finalImage,
        iconName: iconName || 'Sparkles'
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E3D8] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EAE7DC] bg-[#FAF9F5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 flex items-center justify-center text-[#FF6B2B]">
                {isNew ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-neutral-900 leading-tight">
                  {isNew ? 'Agregar Nueva Categoría' : 'Editar Categoría'}
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {isNew ? (
                    <span>Creá un nuevo rubro para tus productos y portada</span>
                  ) : (
                    <span>Editar detalles de <strong className="text-[#FF6B2B]">{category?.name}</strong> (ID: <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">{category?.id}</code>)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isNew && category && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-all text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title={`Eliminar categoría ${category.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar Categoría</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Live Preview Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#FF6B2B]" />
                  Vista Previa en Vivo (Cómo se ve en la tienda)
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Resolución recomendada: 800x600 px
                </span>
              </div>

              <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-[#FF6B2B] shadow-lg shadow-[#FF6B2B]/10 relative bg-white">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-neutral-100">
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/25 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#FF6B2B] shadow-sm">
                    <SelectedIconComp className="w-4 h-4" />
                  </div>

                  <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md text-white flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base sm:text-lg font-black font-['Outfit'] leading-tight mb-0.5">
                      {name || 'Nombre de la Categoría'}
                    </h3>
                    <span className="text-[11px] text-neutral-300 font-medium">
                      {currentCount} {currentCount === 1 ? 'modelo disponible' : 'modelos disponibles'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#EAE7DC]/60">
                  <span className="text-neutral-500 line-clamp-1 font-medium text-[11px]">
                    {description || 'Descripción de la categoría...'}
                  </span>
                </div>
              </div>
            </div>

            {/* General Information (Name, ID, Description) */}
            <div className="space-y-4 bg-white p-4 rounded-2xl border border-[#E5E3D8]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/20 focus:border-[#FF6B2B]"
                    placeholder="Ej: Lámparas 3D, Vasos, Anime..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-800">
                      ID / Slug Identificador
                    </label>
                    {isNew && (
                      <button
                        type="button"
                        onClick={() => setIsCustomId(!isCustomId)}
                        className="text-[10px] text-[#FF6B2B] hover:underline font-bold"
                      >
                        {isCustomId ? 'Auto-generar' : 'Personalizar ID'}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={id}
                    disabled={!isNew || !isCustomId}
                    onChange={(e) => {
                      setIsCustomId(true);
                      setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                      isNew && isCustomId 
                        ? 'border-neutral-300 bg-white text-neutral-900 focus:ring-2 focus:ring-[#FF6B2B]/20 focus:border-[#FF6B2B]' 
                        : 'border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed'
                    }`}
                    placeholder="ej: lamparas-3d"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Descripción o Subtítulo corto
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/20 focus:border-[#FF6B2B]"
                  placeholder="Ej: Diseños y veladores únicos impresos en 3D..."
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Ícono Distintivo
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = iconName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIconName(item.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-[#FF6B2B] font-bold shadow-xs'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DOBLE OPCIÓN: ARCHIVO LOCAL O ENLACE DIRECTO */}
            <div className="space-y-3 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E3D8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    <span>Foto de Portada de la Categoría</span>
                  </label>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                    Doble opción: Podés subir fotos desde tu celular/PC o pegar un enlace web de imagen (https://...).
                  </p>
                </div>

                {/* Segmented Control */}
                <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-neutral-200 shadow-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setPhotoTab('upload')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      photoTab === 'upload'
                        ? 'bg-[#111111] text-white shadow-sm ring-1 ring-black'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    <span>1. Celular / PC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('url')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      photoTab === 'url'
                        ? 'bg-[#111111] text-white shadow-sm ring-1 ring-black'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    <span>2. Enlace Web (URL)</span>
                  </button>
                </div>
              </div>

              {/* OPCIÓN 1: SUBIR DESDE CELULAR / COMPUTADORA */}
              {photoTab === 'upload' && (
                <div className="space-y-3 pt-1">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#FF6B2B] bg-[#FFF5EE] scale-[1.01]'
                        : isUploading
                        ? 'border-orange-300 bg-orange-50/50 cursor-wait'
                        : 'border-[#D9D6C8] hover:border-[#FF6B2B] bg-white hover:bg-[#FFFDFB]'
                    }`}
                  >
                    {isUploading ? (
                      <div className="space-y-2.5 py-2">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mx-auto animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        </div>
                        <p className="text-xs font-bold text-neutral-800">
                          Optimizando y guardando foto... ({uploadProgress}%)
                        </p>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
                          <div
                            className="bg-[#FF6B2B] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mx-auto border border-[#FF6B2B]/20">
                          <CloudUpload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">
                            Tocá acá para elegir foto de tu celular o PC
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 max-w-md mx-auto">
                            Soporta JPG, PNG o WebP. Se comprime automáticamente en WebP ultra liviano para que cargue súper rápido y se guarde de forma permanente en Firebase.
                          </p>
                        </div>
                        <span className="inline-block px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors shadow-xs">
                          Examinar Galería / Archivos
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />

                  {imageUrl && (
                    <div className="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Foto asignada y lista
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          addToast('Foto eliminada', 'info');
                        }}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Quitar Foto</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* OPCIÓN 2: ENLACE WEB DIRECTO */}
              {photoTab === 'url' && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value.trim())}
                      placeholder="https://images.unsplash.com/... o enlace de tu imagen"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/20 focus:border-[#FF6B2B]"
                    />
                    <button
                      type="button"
                      onClick={handlePasteUrl}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Pegar enlace desde el portapapeles"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#FF6B2B]" />
                      <span className="hidden sm:inline">Pegar Enlace</span>
                    </button>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          addToast('Foto de portada eliminada', 'info');
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        title="Eliminar foto de portada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#EAE7DC] text-[11px] text-neutral-600 space-y-1">
                    <p className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Link2 className="w-3 h-3 text-[#FF6B2B]" />
                      <span>Fotos alojadas en la web:</span>
                    </p>
                    <p className="text-neutral-500 leading-relaxed">
                      Pegá un enlace directo (que termine en <code>.jpg</code>, <code>.png</code>, <code>.webp</code> o de servicios como <strong>Postimages, Imgur, Unsplash o Google Drive (enlace público de imagen)</strong>. Se guardará de forma permanente en Firebase Firestore.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Preset Suggestions */}
            <div>
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-2">
                Fotos Profesionales Recomendadas
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border text-left p-1.5 transition-all group ${
                      imageUrl === preset.url
                        ? 'border-[#FF6B2B] ring-2 ring-[#FF6B2B]/30 bg-orange-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-1.5 relative bg-neutral-100">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {imageUrl === preset.url && (
                        <div className="absolute inset-0 bg-[#FF6B2B]/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-[#FF6B2B] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-700 line-clamp-1 block px-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EAE7DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {!isNew && category && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white bg-rose-50 border border-rose-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Eliminar esta categoría permanentemente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Categoría</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const defaultCat = presets[0];
                    if (defaultCat) setImageUrl(defaultCat.url);
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-800 font-bold flex items-center gap-1.5 transition-colors px-2 py-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar foto</span>
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      addToast('Foto eliminada', 'info');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 transition-colors px-2 py-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar foto</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF6B2B] text-white hover:bg-[#e05316] transition-all shadow-md shadow-[#FF6B2B]/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{isNew ? 'Crear Categoría' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>

          </form>

          {/* IN-APP CONFIRM DELETE OVERLAY */}
          <AnimatePresence>
            {showConfirmDelete && category && (
              <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs rounded-3xl flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-rose-200 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black font-['Outfit'] text-neutral-900 leading-tight">
                        ¿Eliminar esta categoría?
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium">
                        {category.name} (ID: {category.id})
                      </p>
                    </div>
                  </div>

                  {currentCount > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <span className="text-sm shrink-0">⚠️</span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Tiene {currentCount} producto(s) asignado(s). Los productos seguirán en el catálogo pero sin esta categoría.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Esta acción eliminará permanentemente la categoría de la tienda y de Firebase.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmDelete(false);
                        deleteCategory(category.id);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sí, Eliminar Ahora</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
