import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Check, 
  Sparkles, 
  Truck, 
  Package, 
  Award,
  Layers
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHOLESALE_TIERS } from '../data/products';
import corporateKeychainsImg from '../assets/images/llaveros_corporate_souvenir_1788756879809.jpg';

export const WholesaleSection: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>(WHOLESALE_TIERS[0].id || 'pack-corporate-llaveros');

  const activeTier = WHOLESALE_TIERS.find(t => t.id === selectedTierId) || WHOLESALE_TIERS[0];

  const handleOpenWhatsAppWholesale = (tierTitle: string, discount: string, minUnits: string) => {
    const text = `Hola Thunder 3D! Me interesa cotizar el ${tierTitle} con ${discount} (${minUnits}). ¿Podrían enviarme opciones de personalización y lista de precios?`;
    window.open(`https://wa.me/5491126718294?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Image mapping for tiers
  const getTierImage = (tierId?: string) => {
    if (tierId === 'pack-corporate-llaveros' || !tierId) {
      return corporateKeychainsImg;
    }
    if (tierId === 'pack-comercio-jarras') {
      return 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80';
    }
    return corporateKeychainsImg;
  };

  return (
    <section id="mayoristas" className="py-16 sm:py-20 relative overflow-hidden bg-[#090F0E] text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-950/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#FF6B2B]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-black text-[#FF8247] uppercase tracking-wider mb-3 bg-[#FF6B2B]/15 px-4 py-1.5 rounded-full border border-[#FF6B2B]/30">
            <Building2 className="w-3.5 h-3.5" />
            Atención a Empresas, Clubes y Comercios
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] mb-3 text-white tracking-tight">
            Merchandising & Regalos Corporativos
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal max-w-lg mx-auto leading-relaxed">
            Fabricación seriada de alta precisión con matrices personalizadas para tu marca o evento.
          </p>
        </div>

        {/* Tier Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {WHOLESALE_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                id={`tier-tab-${tier.id}`}
                onClick={() => setSelectedTierId(tier.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#204541] to-[#163833] text-[#7EE7D9] border border-[#5DA89D]/70 shadow-lg shadow-emerald-950/60 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{tier.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-[#5DA89D]/30 text-[#A2F2E6]' : 'bg-white/10 text-neutral-300'
                }`}>
                  {tier.discount}
                </span>
              </button>
            );
          })}
        </div>

        {/* THE FEATURED LUXURY PROMOTIONAL CARD */}
        <div className="max-w-2xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#111C1A] via-[#0E1615] to-[#090F0E] p-6 sm:p-10 lg:p-11 border border-[#2B423D] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Subtle geometric wireframe watermark (top-right & bottom-left) */}
              <svg 
                className="absolute top-0 right-0 w-64 h-64 opacity-15 pointer-events-none text-emerald-400" 
                viewBox="0 0 200 200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.8"
              >
                <path d="M120,0 L200,60 L200,160 L140,200 L60,160 L100,80 Z" />
                <path d="M140,20 L180,80 L140,140 L80,100 Z" />
                <line x1="120" y1="0" x2="140" y2="140" strokeWidth="0.6" />
                <line x1="200" y1="60" x2="80" y2="100" strokeWidth="0.6" />
                <polygon points="40,20 90,50 60,110 10,80" strokeWidth="0.5" />
              </svg>

              <svg 
                className="absolute -bottom-10 -left-10 w-52 h-52 opacity-10 pointer-events-none text-teal-300" 
                viewBox="0 0 200 200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.8"
              >
                <path d="M50,150 L120,80 L180,120 L110,190 Z" />
                <line x1="50" y1="150" x2="180" y2="120" />
              </svg>

              {/* 4-point Diamond Star Ornament in Bottom Right */}
              <div className="absolute bottom-6 right-6 pointer-events-none text-emerald-200/40">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </div>

              {/* 1. Brushed Metallic Teal Pill Badge: 20% OFF */}
              <div className="flex justify-center mb-6 sm:mb-7">
                <div className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-b from-[#3E6C65] via-[#234A44] to-[#142F2B] border border-[#6BB5A9]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-wider text-[#85EDE0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                    {activeTier.discount}
                  </span>
                </div>
              </div>

              {/* 2. Eyebrow Tag: DESDE 30 UNIDADES */}
              <div className="text-left mb-2">
                <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase font-['Outfit'] text-[#E08244]">
                  {activeTier.minUnits}
                </span>
              </div>

              {/* 3. Title: Pack Llaveros Souvenir */}
              <h3 className="text-left text-2xl sm:text-3xl lg:text-[34px] font-black font-['Outfit'] text-[#EADBBF] tracking-tight leading-snug mb-2">
                {activeTier.title}
              </h3>

              {/* 4. Subtitle with emojis */}
              <p className="text-left text-xs sm:text-sm text-[#AAB8B5] mb-6 leading-relaxed">
                {activeTier.subtitle || activeTier.description}
              </p>

              {/* Subtle hairline divider */}
              <div className="border-t border-white/10 mb-6 sm:mb-8" />

              {/* 5. Main Content Area: Left Checkmarks List + Right Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-8">
                
                {/* Features List */}
                <div className="sm:col-span-7 space-y-3.5 text-left">
                  {activeTier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#B2642E] border border-[#D97736]/40 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-[#EDEBE4] font-medium leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Keychain Showcase Image */}
                <div className="sm:col-span-5 flex justify-center sm:justify-end mt-4 sm:mt-0">
                  <div className="relative group/showcase max-w-[240px] sm:max-w-none w-full">
                    {/* Atmospheric glow behind image */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl pointer-events-none" />
                    
                    <img
                      src={getTierImage(activeTier.id)}
                      alt={`Muestra de ${activeTier.title}`}
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full aspect-[4/3] object-cover rounded-2xl border border-white/15 shadow-2xl transition-transform duration-500 group-hover/showcase:scale-105"
                    />
                  </div>
                </div>

              </div>

              {/* 6. Action Button: COTIZAR ESTE LOTE (with WhatsApp icon & ambient glow) */}
              <div className="relative pt-2">
                {/* Cyan / emerald glow under button */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-3/4 h-8 bg-emerald-400/30 rounded-full blur-xl pointer-events-none" />
                
                <button
                  id={`quote-tier-btn-${activeTier.id}`}
                  onClick={() => handleOpenWhatsAppWholesale(activeTier.title, activeTier.discount, activeTier.minUnits)}
                  className="relative z-10 w-full py-4 px-6 rounded-full bg-gradient-to-b from-[#283330] via-[#1A2220] to-[#111716] border-2 border-[#546B65] hover:border-[#34D399] transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.8)] active:scale-[0.99] flex items-center justify-center gap-3 group"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-[#EDEBE4] group-hover:fill-[#25D366] transition-colors" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-[#EDEBE4] group-hover:text-white transition-colors font-['Outfit']">
                    COTIZAR ESTE LOTE
                  </span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Value Props Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-neutral-900/80 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2B]/20 text-[#FF8247] flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Catálogo Completo</div>
              <div className="text-[11px] text-neutral-400">Jarras, mates, llaveros, cerámica y cortantes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2B]/20 text-[#FF8247] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Personalización con Logo</div>
              <div className="text-[11px] text-neutral-400">Matrices exclusivas para tu marca</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2B]/20 text-[#FF8247] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Envíos Rápidos en CABA</div>
              <div className="text-[11px] text-neutral-400">Embalaje reforzado antichoque</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2B]/20 text-[#FF8247] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Control de Calidad 3D</div>
              <div className="text-[11px] text-neutral-400">Terminaciones prolijas y reposición garantizada</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
