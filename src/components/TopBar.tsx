import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Sparkles, MessageCircle, ShieldCheck, Zap } from 'lucide-react';

export const TopBar: React.FC = () => {
  const announcements = [
    { text: 'Envíos solamente en CABA en 24/48 hs', icon: Truck },
    { text: 'Productos impresos en 3D con filamentos eco-friendly', icon: Sparkles },
    { text: 'Atención personalizada por WhatsApp', icon: MessageCircle },
    { text: '10% OFF extra abonando por Transferencia Bancaria', icon: ShieldCheck },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-[#111111] text-[#E4E4E7] border-b border-white/10 text-xs py-2 px-4 select-none relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left item (desktop) */}
        <div className="hidden md:flex items-center gap-6 text-neutral-400 font-medium">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-[#FF6B2B]" />
            Envíos solamente en CABA
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-neutral-700"></span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Zap className="w-3.5 h-3.5 text-[#FF6B2B]" />
            Productos impresos en 3D
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-neutral-700"></span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageCircle className="w-3.5 h-3.5 text-[#FF6B2B]" />
            Atención personalizada
          </span>
        </div>

        {/* Center rotating announcement (mobile & desktop highlight) */}
        <div className="flex-1 md:flex-none flex items-center justify-center h-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 font-medium text-[#FF8247]"
            >
              {React.createElement(announcements[currentIndex].icon, { className: 'w-3.5 h-3.5 shrink-0 text-[#FF6B2B]' })}
              <span className="text-center font-semibold text-[11px] sm:text-xs">
                {announcements[currentIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right CTA / Promo Code */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-neutral-400 text-xs">Cupón 10% OFF:</span>
          <span className="bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase">
            THUNDER10
          </span>
        </div>

      </div>
    </div>
  );
};
