import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Heart, 
  Star, 
  Layers, 
  Clock, 
  Maximize2, 
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ProductImageZoom } from './ProductImageZoom';
import { ProductDescription } from './ProductDescription';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    isFavorite, 
    toggleFavorite,
    whatsappNumber,
    addToCart,
    setIsCartOpen,
    isCartDisabled
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedColor(quickViewProduct.colors?.[0]);
      setJustAdded(false);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const favorite = isFavorite(product.id);

  const handleOrderWhatsApp = () => {
    const phone = whatsappNumber || '5491123456789';
    const msg = encodeURIComponent(
      `¡Hola Thunder 3D! 👋 Quiero encargar el siguiente producto impreso en 3D:\n\n` +
      `📦 *${product.name}*\n` +
      `💰 Precio: $${product.price.toLocaleString('es-AR')}\n` +
      `🧪 Material: ${product.printMaterial}\n` +
      `📏 Dimensiones: ${product.dimensions}\n` +
      `⏱️ Tiempo 3D: ${product.printTime}\n\n` +
      `¿Cuáles son las opciones de entrega o retiro en CABA y tiempos de producción? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setQuickViewProduct(null);
      setIsCartOpen(true);
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
      />

      {/* Floating mobile close button in corner - always visible even during page scroll */}
      <button
        type="button"
        onClick={() => setQuickViewProduct(null)}
        aria-label="Cerrar ventana"
        className="sm:hidden fixed top-3 right-3 z-[60] w-10 h-10 rounded-full bg-[#111111] text-white border-2 border-white/30 flex items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl border border-[#E5E3D8] z-10 my-1 sm:my-8 flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
      >
        {/* Sticky Mobile Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2.5 sm:hidden border-b border-[#EAE7DC] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-[10px] font-black uppercase tracking-wider shrink-0">
              {product.categoryLabel}
            </span>
            <span className="text-xs font-bold text-[#111111] truncate max-w-[180px]">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#FF6B2B] text-white text-xs font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Desktop Close button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          title="Cerrar ventana"
          className="hidden sm:flex absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-[#FDFCF0] border border-[#E5E3D8] items-center justify-center text-[#111111] hover:bg-[#FF6B2B] hover:text-white shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left: Product Image & Interactive Zoom Presentation (6 cols) */}
            <div className="md:col-span-6 bg-[#FDFCF0] p-3 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5E3D8] h-full">
              <ProductImageZoom
                src={product.image}
                images={product.additionalImages}
                alt={product.name}
                isOffer={product.isOffer}
                discountPercent={product.discountPercent}
                material={product.printMaterial}
                className="h-full"
              />
            </div>

            {/* Right: Product Details & Actions (6 cols) */}
            <div className="md:col-span-6 p-4 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#FF6B2B] font-black uppercase tracking-wider text-[10px]">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-400 font-medium">({product.reviewsCount} opiniones)</span>
                  </div>
                </div>

                {/* Title */}
                <h2 id="quickview-title" className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#111111] mb-2 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#111111]">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-neutral-400 line-through font-bold">
                      ${product.originalPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                {/* Long Description Formatted */}
                <div className="mb-4 sm:mb-5">
                  <ProductDescription description={product.longDescription || product.description} />
                </div>

                {/* Technical Specs Tags */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8]">
                  <div className="flex items-center gap-2 text-[#111111]">
                    <Layers className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                    <span className="text-[11px]"><strong>Material:</strong> {product.printMaterial}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#111111]">
                    <Clock className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                    <span className="text-[11px]"><strong>Tiempo 3D:</strong> {product.printTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#111111] col-span-2">
                    <Maximize2 className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                    <span className="text-[11px]"><strong>Dimensiones:</strong> {product.dimensions}</span>
                  </div>
                </div>

                {/* Selector de cantidad y color si aplica */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8] mb-3">
                  {/* Cantidad */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">Cantidad:</span>
                    <div className="flex items-center border border-[#E5E3D8] bg-white rounded-xl overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-black text-neutral-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Colores si existen */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-600">Color:</span>
                      <div className="flex items-center gap-1.5">
                        {product.colors.map(col => (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => setSelectedColor(col)}
                            title={col.name}
                            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                              selectedColor?.name === col.name 
                                ? 'border-[#FF6B2B] scale-110 shadow-xs ring-2 ring-[#FF6B2B]/20' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-[#EAE7DC] space-y-2.5 sm:space-y-3">
                {/* 1. AGREGAR AL CARRITO (Oculto cuando el carrito está desactivado) */}
                {!isCartDisabled && (
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer ${
                      justAdded 
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                        : 'bg-gradient-to-r from-[#FF6B2B] to-[#F25A1B] text-white hover:brightness-105 shadow-[#FF6B2B]/25'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>¡Agregado al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleOrderWhatsApp}
                    className={`flex-1 rounded-2xl font-black uppercase tracking-wider transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white cursor-pointer ${
                      isCartDisabled ? 'py-3.5 sm:py-4 text-xs sm:text-sm shadow-md' : 'py-3 px-4 text-xs sm:text-sm font-bold'
                    }`}
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Consultar por WhatsApp</span>
                  </button>

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Favorito"
                    className="w-11 h-11 rounded-2xl border border-[#E5E3D8] bg-[#FDFCF0] flex items-center justify-center text-neutral-500 hover:text-rose-600 hover:border-rose-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>


                {/* Botón Volver a la tienda */}
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FF6B2B] hover:bg-[#e0561c] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-[#FF6B2B]/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                  <span>Volver a la tienda</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};
