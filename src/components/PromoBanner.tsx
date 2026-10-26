import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Tag, 
  Flame, 
  Zap,
  Truck,
  Percent,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const PromoBanner: React.FC = () => {
  const { addToast } = useCart();
  const [copied, setCopied] = useState(false);

  const promoCode = 'THUNDER10';

  const marqueeOffers = [
    { text: '10% OFF EN TU PRIMERA COMPRA • CÓDIGO THUNDER10', icon: Tag, highlight: true },
    { text: 'ENVÍOS SOLAMENTE EN CABA EN 24/48 HS', icon: Truck, highlight: false },
    { text: 'MOTO CABA BONIFICADA EN COMPRAS DESDE $35.000', icon: Zap, highlight: false },
    { text: '10% OFF EXTRA ABONANDO POR TRANSFERENCIA BANCARIA', icon: Percent, highlight: true },
    { text: 'MERCHANDISING & REGALOS CORPORATIVOS AL POR MAYOR', icon: Layers, highlight: false },
    { text: 'FILAMENTOS PREMIUM BIODEGRADABLES PLA / PETG', icon: Sparkles, highlight: false },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    addToast('¡Código THUNDER10 copiado! Mencionálo al pedir por WhatsApp para tu 10% OFF.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[36px] sm:rounded-[44px] bg-[#111111] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-white/10">
          
          {/* Bento Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B2B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#FF8247]/15 rounded-full blur-3xl pointer-events-none" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2B]/20 text-[#FF8247] border border-[#FF6B2B]/30 text-[11px] font-black uppercase tracking-wider mb-4">
                <Flame className="w-4 h-4 fill-[#FF6B2B] text-[#FF6B2B]" />
                Descuento de Bienvenida
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight leading-tight mb-4">
                10% OFF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2B] to-[#FF8247]">EN TU PRIMER PEDIDO</span>
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm font-normal mb-8 max-w-xl leading-relaxed">
                Aprovechá este descuento especial en cualquiera de nuestros productos de catálogo o piezas personalizadas. Mencioná el cupón al coordinar tu pedido.
              </p>

              {/* Coupon Box */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center bg-black/60 border border-[#FF6B2B]/40 rounded-2xl px-4 py-3 shadow-inner">
                  <Tag className="w-4 h-4 text-[#FF6B2B] mr-2" />
                  <span className="font-mono text-base font-black text-[#FF8247] tracking-wider">
                    {promoCode}
                  </span>
                </div>

                <button
                  id="promo-copy-coupon-button"
                  onClick={handleCopyCode}
                  className="px-6 py-3 rounded-2xl bg-[#FF6B2B] hover:bg-[#F25A1B] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#FF6B2B]/20 active:scale-95 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar código de descuento
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <Zap className="w-3.5 h-3.5 text-[#FF6B2B]" />
                <span>Válido solamente para envíos en CABA</span>
              </div>

            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm">
                
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-neutral-900 shadow-xl aspect-[4/3] group">
                  <img
                    src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
                    alt="Coleccionable impreso en 3D Thunder 3D"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8247] block">
                      Diseño Coleccionable
                    </span>
                    <span className="text-sm font-black font-['Outfit'] block">
                      Dragón Articulado Fidget en Seda Bicolor
                    </span>
                  </div>
                </div>

                {/* Floating promo badge */}
                <div className="absolute -top-3 -right-3 bg-[#FF6B2B] text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 animate-bounce uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  -10% Extra
                </div>

              </div>
            </div>

          </div>

          {/* Infinite Scrolling Marquee */}
          <div className="relative z-10 mt-8 pt-5 border-t border-white/10 -mx-6 sm:-mx-10 lg:-mx-12 px-6 sm:px-10 lg:px-12 overflow-hidden">
            {/* Gradient Edge Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />

            <div className="flex overflow-hidden py-1">
              <motion.div
                className="flex items-center gap-8 shrink-0 pr-8 select-none"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  repeat: Infinity,
                  ease: 'linear',
                  duration: 28,
                }}
              >
                {[...marqueeOffers, ...marqueeOffers, ...marqueeOffers, ...marqueeOffers].map((offer, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs font-black uppercase tracking-wider ${
                      offer.highlight ? 'text-[#FF8247]' : 'text-neutral-300'
                    }`}
                  >
                    <offer.icon className={`w-3.5 h-3.5 shrink-0 ${offer.highlight ? 'text-[#FF6B2B]' : 'text-neutral-400'}`} />
                    <span className="whitespace-nowrap">{offer.text}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B]/40 ml-4 shrink-0" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
