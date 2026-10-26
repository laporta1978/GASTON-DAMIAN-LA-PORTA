import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  MessageSquareText, 
  Truck
} from 'lucide-react';
import { BENEFITS } from '../data/products';

export const Benefits: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    ShieldCheck,
    Sparkles,
    Zap,
    MessageSquareText,
    Truck
  };

  return (
    <section id="beneficios" className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6B2B] bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 px-3.5 py-1 rounded-full inline-block mb-2">
            ¿Por qué elegir Thunder 3D?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#111111]">
            Excelencia en cada capa de impresión
          </h2>
        </div>

        {/* 5 Benefits Bento Modular Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BENEFITS.map((benefit, index) => {
            const IconComponent = iconMap[benefit.iconName] || Zap;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="bg-white rounded-3xl p-5 border border-[#E5E3D8] hover:border-[#FF6B2B]/40 hover:shadow-md hover:shadow-[#FF6B2B]/5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon container */}
                  <div className="w-11 h-11 rounded-2xl bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 text-[#FF6B2B] flex items-center justify-center mb-4 group-hover:bg-[#FF6B2B] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Badge */}
                  <span className="inline-block text-[10px] font-black text-[#FF6B2B] bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                    {benefit.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#111111] mb-1.5 font-['Outfit']">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
