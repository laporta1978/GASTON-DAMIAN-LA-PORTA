import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageCircle, 
  Sparkles, 
  Truck, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/products';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('1');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleItem = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredItems = FAQ_ITEMS.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 relative overflow-hidden bg-white/70 border-y border-[#E5E3D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            Centro de Ayuda & Respuestas
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#111111] mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Todo lo que necesitás saber sobre tiempos de producción, materiales 3D, envíos y pedidos especiales.
          </p>
        </div>

        {/* Quick Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'general', label: 'Materiales & Cuidados' },
              { id: 'envios', label: 'Envíos & Entregas' },
              { id: 'personalizados', label: 'Personalizados' },
              { id: 'mayoristas', label: 'Mayoristas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-[#FF6B2B] text-white shadow-sm shadow-[#FF6B2B]/30'
                    : 'bg-white text-neutral-600 hover:text-[#FF6B2B] border border-[#E5E3D8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white rounded-full border border-[#E5E3D8] focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/15"
            />
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-[#E5E3D8]">
              <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-700">No encontramos resultados para tu búsqueda</p>
              <p className="text-xs text-neutral-500 mt-1">Escribinos directamente al WhatsApp y te responderemos al instante.</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all border ${
                    isOpen 
                      ? 'bg-white border-[#FF6B2B]/40 shadow-sm shadow-[#FF6B2B]/10' 
                      : 'bg-white/80 border-[#E5E3D8] hover:border-neutral-300'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-xs sm:text-sm font-extrabold font-['Outfit'] text-[#111111] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B2B] shrink-0" />
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#FF6B2B]/10 text-[#FF6B2B] rotate-180' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-[#EAE7DC]/60 font-normal">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp CTA Callout */}
        <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black font-['Outfit'] text-white">¿Tenés otra duda específica?</div>
              <div className="text-[11px] text-neutral-400">Atendemos consultas técnicas directo desde el taller.</div>
            </div>
          </div>

          <a
            href="https://wa.me/5491126718294?text=Hola%20Thunder%203D!%20Tengo%20una%20pregunta%20sobre%20sus%20productos"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            Consultar por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
