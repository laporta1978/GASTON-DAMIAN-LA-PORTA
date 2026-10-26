import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Box,
  Eye
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const Hero: React.FC = () => {
  const { setQuickViewProduct, products } = useCart();
  const heroFeaturedProduct = products.find(p => p.id === 'chopp-vikingo-nordico-3d' || p.category === 'jarras') || products[0] || PRODUCTS[0];

  const scrollToProducts = () => {
    const el = document.getElementById('productos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-4 pb-12 md:pt-8 md:pb-16 overflow-hidden">
      
      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bento-dot-grid-subtle -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Top Arrangement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Bento Card (Col 1-7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 border border-[#E5E3D8] shadow-sm flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Ambient Bento Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF6B2B]/10 via-[#FF8247]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F6EE] border border-[#E5E3D8] text-[11px] font-black text-neutral-800 mb-6 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF6B2B] animate-pulse" />
                <span className="text-[#FF6B2B]">DISEÑOS QUE COBRAN VIDA</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-600 hidden sm:inline">Fabricación 3D en CABA</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-[#111111] leading-[1.08] mb-6">
                Impresiones <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2B] via-[#FF8247] to-[#F25A1B]">3D</span> para tu mundo
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-8 max-w-xl">
                Productos personalizados, diseños únicos y fabricación 3D con excelente calidad. Transformamos ideas digitales en objetos reales para tu setup, hogar y proyectos.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
                <button
                  id="hero-btn-ver-productos"
                  onClick={scrollToProducts}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#111111] text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#FF6B2B] transition-all shadow-md active:scale-98 group"
                >
                  Ver productos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Key Bento Metric Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EAE7DC]">
              <div className="bg-[#FDFCF0] p-3 rounded-2xl border border-[#EAE7DC]/80">
                <div className="text-lg sm:text-2xl font-black font-['Outfit'] text-[#111111]">
                  0.1<span className="text-[#FF6B2B] text-xs sm:text-sm">mm</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Resolución</div>
              </div>

              <div className="bg-[#FDFCF0] p-3 rounded-2xl border border-[#EAE7DC]/80">
                <div className="text-lg sm:text-2xl font-black font-['Outfit'] text-[#111111]">
                  24/48<span className="text-[#FF6B2B] text-xs sm:text-sm">hs</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Despacho CABA</div>
              </div>

              <div className="bg-[#FDFCF0] p-3 rounded-2xl border border-[#EAE7DC]/80">
                <div className="text-lg sm:text-2xl font-black font-['Outfit'] text-[#111111]">
                  100%
                </div>
                <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">PLA </div>
              </div>
            </div>

          </motion.div>

          {/* Right Bento Column: Showcase + Floating Bento Modules (Col 8-12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            
            {/* Bento Card: Hero Product Showcase */}
            <div className="bg-[#FFFFFF] rounded-[36px] sm:rounded-[44px] p-5 sm:p-6 border border-[#E5E3D8] shadow-sm flex-1 flex flex-col justify-between relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-black text-neutral-700 tracking-wider uppercase">
                    Granja 3D Activa • En Línea
                  </span>
                </div>
                <span className="text-[11px] font-black text-[#FF6B2B] bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20 uppercase">
                  Mejor Vendido
                </span>
              </div>

              {/* Product Visual */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 group">
                <img
                  src={heroFeaturedProduct.image}
                  alt={heroFeaturedProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent" />
                
                {/* Floating in-image meta */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="max-w-[75%]">
                    <span className="text-[10px] text-[#FF8247] font-black uppercase tracking-widest block truncate">
                      {heroFeaturedProduct.categoryLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-bold truncate block">
                      {heroFeaturedProduct.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setQuickViewProduct(heroFeaturedProduct)}
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-[#FF6B2B] transition-colors text-white shrink-0"
                    title="Vista rápida"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Action / Price Row */}
              <div className="mt-4 pt-3 border-t border-[#EAE7DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-wider block">
                    {heroFeaturedProduct.isOffer ? 'Precio oferta' : 'Precio'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-['Outfit'] text-[#111111]">
                      ${heroFeaturedProduct.price.toLocaleString('es-AR')}
                    </span>
                    {heroFeaturedProduct.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through font-semibold">
                        ${heroFeaturedProduct.originalPrice.toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setQuickViewProduct(heroFeaturedProduct)}
                  className="px-5 py-3 rounded-2xl bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6B2B] transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver pieza
                </button>
              </div>

            </div>

            {/* Split Bento Dual Feature Badges */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-[#F7F6EE] rounded-3xl p-4 border border-[#E5E3D8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#FF6B2B]" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#111111] uppercase tracking-tight">
                    Producción Rápida
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    Despacho 24/48 hs
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F6EE] rounded-3xl p-4 border border-[#E5E3D8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#111111] uppercase tracking-tight">
                    Bajo Pedido
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    Calidad y detalle único
                  </div>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
