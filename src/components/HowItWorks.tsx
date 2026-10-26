import React from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  MessageCircle, 
  Cpu, 
  PackageCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/products';

export const HowItWorks: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Layers,
    MessageCircle,
    Cpu,
    PackageCheck
  };

  return (
    <section id="como-comprar" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
            <Sparkles className="w-3.5 h-3.5" />
            Guía de Compra • Simple & Rápido
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#111111] mb-2">
            ¿Cómo comprar?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            De la pantalla a tus manos en 4 simples pasos con seguimiento en tiempo real.
          </p>
        </div>

        {/* 4 Steps Bento Modular Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const IconComponent = iconMap[step.iconName] || Layers;
            const isLast = index === HOW_IT_WORKS_STEPS.length - 1;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="relative bg-white rounded-3xl p-6 border border-[#E5E3D8] hover:border-[#FF6B2B]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] border border-[#FF6B2B]/20 flex items-center justify-center group-hover:bg-[#FF6B2B] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span className="font-mono text-2xl font-black text-neutral-300 group-hover:text-[#FF6B2B] transition-colors">
                      {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black font-['Outfit'] text-[#111111] mb-1.5">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    {step.description}
                  </p>

                </div>

                {/* Sub-indicator */}
                <div className="mt-5 pt-3 border-t border-[#EAE7DC] flex items-center justify-between text-[11px] font-bold text-neutral-400">
                  <span className="group-hover:text-[#FF6B2B] transition-colors">
                    Paso {index + 1} de 4
                  </span>
                  {!isLast && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-neutral-300 group-hover:text-[#FF6B2B] group-hover:translate-x-1 transition-all" />
                  )}
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
