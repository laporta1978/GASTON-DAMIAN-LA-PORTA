import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Scan, 
  X, 
  Move,
  Flame,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Eye
} from 'lucide-react';

interface ProductImageZoomProps {
  src: string;
  images?: string[];
  alt: string;
  isOffer?: boolean;
  discountPercent?: number;
  material?: string;
  className?: string;
}

export const ProductImageZoom: React.FC<ProductImageZoomProps> = ({
  src,
  images = [],
  alt,
  isOffer,
  discountPercent,
  material,
  className = ""
}) => {
  // Combine all images into a deduplicated list, up to 3 items
  const rawList = [src, ...(images || [])].filter(Boolean) as string[];
  const allImages = Array.from(new Set(rawList)).slice(0, 3);
  
  // If only 1 image provided, we can still have 1 active, but we show the gallery nicely
  const [activeIdx, setActiveIdx] = useState(0);

  // Active image URL
  const currentImage = allImages[activeIdx] || src;

  // Zoom mode in regular container: 'cover' (estirada/completa) | 'contain' (ajustada con márgenes)
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  
  // Interactive Hover Magnifier
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  // Fullscreen Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for container hover zoom
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Next / Previous helpers
  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    resetLightboxZoom();
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    resetLightboxZoom();
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
      } else if (e.key === '+' || e.key === '=') {
        setLightboxZoom(prev => Math.min(prev + 0.5, 4));
      } else if (e.key === '-' || e.key === '_') {
        setLightboxZoom(prev => Math.max(prev - 0.5, 1));
      } else if (e.key === '0') {
        resetLightboxZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  // Lightbox Pan Handlers
  const handleLightboxMouseDown = (e: MouseEvent) => {
    if (lightboxZoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y
    };
  };

  const handleLightboxMouseMove = (e: MouseEvent) => {
    if (!isDragging || lightboxZoom <= 1) return;
    setPanPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleLightboxMouseUp = () => setIsDragging(false);

  const resetLightboxZoom = () => {
    setLightboxZoom(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const labels = ['Foto Principal', 'Detalle / Textura', 'Perspectiva 3D'];

  return (
    <div className={`relative w-full flex-1 flex flex-col justify-between select-none ${className}`}>
      
      {/* 1. Main Large Image Container (taller & stretched vertically) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
        className={`relative w-full flex-1 min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF9F5] via-[#F3F1E6] to-[#E9E5D4] border border-[#E5E3D8] cursor-zoom-in flex items-center justify-center group shadow-inner transition-all ${
          imageFit === 'cover' ? 'p-0' : 'p-3 sm:p-4'
        }`}
      >
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_0%,rgba(240,238,228,0.25)_70%,transparent_100%)] pointer-events-none" />

        {/* Regular / Fitted Image with Key for smooth fade transition */}
        <motion.img
          key={currentImage}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          src={currentImage}
          alt={`${alt} - Foto ${activeIdx + 1}`}
          className={`relative z-10 w-full h-full transition-all duration-300 drop-shadow-md ${
            imageFit === 'cover' 
              ? 'object-cover w-full h-full' 
              : 'object-contain max-h-[480px] md:max-h-[540px]'
          } ${isHovering ? 'opacity-0 md:opacity-0' : 'opacity-100'}`}
        />

        {/* Desktop Interactive Hover Magnifier (High Definition Zoom) */}
        {isHovering && (
          <div
            className="hidden md:block absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Magnifier lens indicator */}
            <div 
              className="absolute w-28 h-28 border-2 border-white/90 rounded-full shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-[#FF6B2B]/5 backdrop-contrast-125 ring-2 ring-[#FF6B2B]/40"
              style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
            >
              <div className="absolute inset-0 rounded-full border border-black/20" />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-30 flex flex-col gap-1.5 pointer-events-none">
          {isOffer && (
            <span className="inline-flex items-center gap-1 bg-[#FF6B2B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              <Flame className="w-3 h-3 fill-white" />
              {discountPercent || 10}% OFF
            </span>
          )}
          {material && (
            <span className="inline-flex items-center gap-1 bg-[#111111]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              <Layers className="w-2.5 h-2.5 text-[#FF6B2B]" />
              {material}
            </span>
          )}
        </div>

        {/* Quick Carousel Arrow Controls on Main Image (if more than 1 image) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              title="Foto anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-[#E5E3D8]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              title="Foto siguiente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-[#E5E3D8]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Right Action Buttons: Stretch Toggle & Fullscreen */}
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageFit(prev => prev === 'cover' ? 'contain' : 'cover');
            }}
            title={imageFit === 'cover' ? 'Cambiar a foto ajustada (con bordes)' : 'Estirar foto completa'}
            className="px-2.5 py-1 rounded-full bg-black/65 hover:bg-[#FF6B2B] text-white flex items-center gap-1 shadow-md transition-all hover:scale-105 active:scale-95 border border-white/20 text-[10px] font-bold backdrop-blur-xs cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5 text-white" />
            <span>{imageFit === 'cover' ? 'Estirada' : 'Ajustada'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            title="Abrir Zoom en Pantalla Completa"
            className="w-8 h-8 rounded-full bg-black/65 hover:bg-[#FF6B2B] text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 border border-white/20 opacity-90 hover:opacity-100 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. Bottom Multi-Photo Gallery Bar (Up to 3 Photos as requested) */}
      <div className="w-full mt-3">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-[#FF6B2B]" />
            <span>Fotos del producto ({allImages.length} de 3)</span>
          </span>
          <span className="text-[10px] font-bold text-neutral-400">
            Hacé clic para cambiar de foto
          </span>
        </div>

        {/* 3 Thumbnails Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {[0, 1, 2].map((slotIdx) => {
            const hasImg = slotIdx < allImages.length;
            const imgUrl = allImages[slotIdx];
            const isCurrent = activeIdx === slotIdx;
            const label = labels[slotIdx] || `Foto ${slotIdx + 1}`;

            if (hasImg) {
              return (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => {
                    setActiveIdx(slotIdx);
                    resetLightboxZoom();
                  }}
                  className={`relative p-1 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center group cursor-pointer ${
                    isCurrent
                      ? 'border-[#FF6B2B] bg-[#FF6B2B]/5 ring-2 ring-[#FF6B2B] shadow-sm scale-102'
                      : 'border-[#E5E3D8] bg-white hover:border-neutral-400 hover:bg-[#FAF9F5]'
                  }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative w-full h-16 sm:h-18 rounded-xl overflow-hidden bg-[#FAF9F5] flex items-center justify-center">
                    <img
                      src={imgUrl}
                      alt={`${alt} miniatura ${slotIdx + 1}`}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Active Overlay Dot */}
                    {isCurrent && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B2B] ring-2 ring-white animate-pulse" />
                    )}

                    {/* Number Badge */}
                    <span className={`absolute bottom-1 left-1 text-[8.5px] font-black px-1.5 py-0.2 rounded-md ${
                      isCurrent ? 'bg-[#FF6B2B] text-white' : 'bg-black/60 text-white'
                    }`}>
                      #{slotIdx + 1}
                    </span>
                  </div>

                  {/* Caption */}
                  <span className={`text-[9.5px] font-bold mt-1 line-clamp-1 ${
                    isCurrent ? 'text-[#FF6B2B]' : 'text-neutral-600'
                  }`}>
                    {label}
                  </span>
                </button>
              );
            }

            // Empty Slot Placeholder if fewer than 3 images
            return (
              <div
                key={slotIdx}
                className="relative p-1 rounded-2xl border border-dashed border-[#E5E3D8] bg-[#FAF9F5]/60 flex flex-col items-center justify-center text-center opacity-60 h-22 sm:h-24"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-200/50 flex items-center justify-center text-neutral-400 mb-1">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-[8.5px] font-bold text-neutral-400">
                  Foto {slotIdx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Fullscreen Lightbox Modal with Multi-Photo Switcher */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Lightbox Header */}
            <div className="flex items-center justify-between z-10" onClick={e => e.stopPropagation()}>
              <div className="text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B2B]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-['Outfit'] tracking-wide">
                    {alt} <span className="text-neutral-400 font-normal">({activeIdx + 1} de {allImages.length})</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {labels[activeIdx] || `Foto ${activeIdx + 1}`} • Alta definición y detalles 3D
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-[#FF6B2B] text-white flex items-center gap-1.5 transition-all text-xs font-bold shrink-0 shadow-md cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Center Canvas with Zoom & Pan and Carousel Arrows */}
            <div 
              className="relative flex-1 flex items-center justify-center overflow-hidden my-3 cursor-grab active:cursor-grabbing"
              onClick={e => e.stopPropagation()}
              onMouseDown={handleLightboxMouseDown}
              onMouseMove={handleLightboxMouseMove}
              onMouseUp={handleLightboxMouseUp}
            >
              {/* Previous Image Arrow */}
              {allImages.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Foto anterior (Flecha izquierda)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <motion.div
                key={currentImage}
                animate={{
                  scale: lightboxZoom,
                  x: panPosition.x,
                  y: panPosition.y
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                <img
                  src={currentImage}
                  alt={`${alt} - Foto ${activeIdx + 1}`}
                  className="max-w-[85vw] max-h-[68vh] object-contain rounded-2xl drop-shadow-2xl pointer-events-none"
                />
              </motion.div>

              {/* Next Image Arrow */}
              {allImages.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Foto siguiente (Flecha derecha)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {lightboxZoom > 1 && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 pointer-events-none">
                  <Move className="w-3.5 h-3.5 text-[#FF6B2B]" />
                  <span>Arrastrá para recorrer la foto</span>
                </div>
              )}
            </div>

            {/* Bottom Floating Control Bar & Mini-Gallery Strip */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Mini Gallery Strip in Lightbox */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveIdx(idx);
                        resetLightboxZoom();
                      }}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                        activeIdx === idx ? 'border-[#FF6B2B] scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Zoom Controls Pill */}
              <div className="bg-neutral-900/90 border border-white/15 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-3 text-white shadow-2xl">
                {/* Zoom Out */}
                <button
                  onClick={() => setLightboxZoom(prev => Math.max(prev - 0.5, 1))}
                  disabled={lightboxZoom <= 1}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-all"
                  title="Alejar (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {/* Current Level */}
                <span className="text-xs font-black font-mono w-12 text-center text-[#FF6B2B]">
                  {Math.round(lightboxZoom * 100)}%
                </span>

                {/* Zoom In */}
                <button
                  onClick={() => setLightboxZoom(prev => Math.min(prev + 0.5, 4))}
                  disabled={lightboxZoom >= 4}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-all"
                  title="Acercar (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/20" />

                {/* Reset Zoom */}
                <button
                  onClick={resetLightboxZoom}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold transition-all"
                  title="Restablecer (0)"
                >
                  <RotateCcw className="w-3 h-3 text-neutral-300" />
                  <span>100%</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
