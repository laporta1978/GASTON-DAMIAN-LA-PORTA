import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Star, 
  Check, 
  Award,
  Layers
} from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
              <Zap className="w-3.5 h-3.5 fill-[#FF6B2B]" />
              ¿Quiénes somos? • Nuestro Taller
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#111111] leading-tight">
              Pasión por el diseño & la fabricación 3D
            </h2>

            <p className="text-neutral-600 text-xs sm:text-sm font-normal leading-relaxed">
              En <strong>Thunder 3D Impresiones</strong> combinamos la ingeniería digital con la pasión por el diseño de vanguardia. Nacimos en Mataderos  con la misión de democratizar la fabricación bajo demanda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-3xl p-5 border border-[#E5E3D8] shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mb-3">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#111111] text-sm mb-1 font-['Outfit']">Filamentos Biodegradables</h3>
                <p className="text-xs text-neutral-500 font-normal leading-relaxed">
                  Utilizamos bioplásticos PLA y PETG , FLEX derivados del almidón de maíz, ecológicos y seguros para el hogar.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#E5E3D8] shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#111111] text-sm mb-1 font-['Outfit']">Precisión Milimétrica</h3>
                <p className="text-xs text-neutral-500 font-normal leading-relaxed">
                  Impresoras FDM calibradas continuamente para lograr capas casi invisibles de 0.15mm.
                </p>
              </div>
            </div>

          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[36px] overflow-hidden shadow-md border border-[#E5E3D8] bg-neutral-900 aspect-[4/5] group">
              <img
                src="/images/laboratorio_impresion_3d.jpg"
                alt="Laboratorio de impresión 3D Thunder 3D"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-black text-[#FF8247] uppercase tracking-wider block mb-1">
                  Laboratorio de Impresión • Republica de Mataderos CABA
                </span>
                <p className="text-base sm:text-lg font-black font-['Outfit']">
                  Granja de impresión 3D activa 24/7
                  
                </p>
              </div>
            </div>

            {/* Floating Bento badge */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-[#E5E3D8] p-3.5 rounded-2xl shadow-md z-20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B2B] text-white flex items-center justify-center font-black text-base">
                +5K
              </div>
              <div>
                <div className="text-xs font-black text-[#111111]">Piezas 3D Impresas</div>
                <div className="text-[10px] text-neutral-500 font-medium">Con satisfacción garantizada</div>
              </div>
            </div>
          </div>

        </div>

        {/* Customer Testimonials Section */}
        <div className="mt-14 pt-10 border-t border-[#EAE7DC]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B2B] bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 px-3 py-1 rounded-full inline-block mb-2">
              Opiniones Reales
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#111111]">
              Lo que dicen nuestros clientes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-[#E5E3D8] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 italic font-normal leading-relaxed mb-4">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE7DC] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[#111111]">{t.name}</h4>
                    <span className="text-[10px] text-neutral-400">{t.role}</span>
                  </div>
                  <span className="text-[10px] text-[#FF6B2B] font-black uppercase bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full">
                    {t.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
