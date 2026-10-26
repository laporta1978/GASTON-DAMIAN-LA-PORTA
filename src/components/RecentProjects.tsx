import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Clock, 
  Maximize2, 
  MessageCircle, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ArrowUpRight,
  Box,
  Sliders,
  Scale,
  Building,
  Gamepad2,
  Palette,
  Briefcase
} from 'lucide-react';
import { RECENT_PROJECTS, GALLERY_STATS, RecentProject } from '../data/recentProjects';
import { useCart } from '../context/CartContext';

export const RecentProjects: React.FC = () => {
  const { setIsCustomModalOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<RecentProject | null>(null);

  const categories = [
    { id: 'all', label: 'Todos los Proyectos', icon: Box },
    { id: 'architecture', label: 'Arquitectura & Maquetas', icon: Building },
    { id: 'engineering', label: 'Ingeniería & Prototipos', icon: Cpu },
    { id: 'cosplay', label: 'Gaming & Cosplay', icon: Gamepad2 },
    { id: 'corporate', label: 'Corporativo & Eventos', icon: Briefcase },
    { id: 'deco', label: 'Arte & Decoración', icon: Palette }
  ];

  const filteredProjects = RECENT_PROJECTS.filter(project => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  const handleConsultProject = (project: RecentProject) => {
    const msg = encodeURIComponent(
      `¡Hola Thunder 3D! 👋 Estuve viendo en su galería de Proyectos Recientes el trabajo:\n` +
      `*${project.title}* (${project.categoryLabel})\n` +
      `Material: ${project.detailedSpecs.material}\n\n` +
      `Tengo un requerimiento similar para cotizar. ¿Cómo podemos coordinar?`
    );
    window.open(`https://wa.me/5491100000000?text=${msg}`, '_blank');
  };

  return (
    <section id="proyectos" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 text-[#FF6B2B] text-[11px] font-black uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Galería del Taller</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-[#111111] tracking-tight">
              Proyectos Recientes a Medida
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-medium">
              Explorá trabajos reales completados para estudios de arquitectura, desarrolladores industriales, cosplayers y empresas. Precisión FDM y SLA garantizada.
            </p>
          </div>

          {/* Quick Quote CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#111111] text-white hover:bg-[#FF6B2B] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#FF6B2B] group-hover:text-white" />
              <span>Cotizar Mi Idea / Archivo 3D</span>
            </button>
          </div>
        </div>

        {/* Bento Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {GALLERY_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-white border border-[#E5E3D8] flex flex-col justify-center shadow-xs"
            >
              <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#111111]">
                {stat.value}
              </span>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#FF6B2B] text-white shadow-xs'
                    : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {filteredProjects.map((project, idx) => {
            const isHero = project.featured && activeCategory === 'all';
            const colSpan = isHero ? 'lg:col-span-8' : (project.gridSpan.colSpan || 'lg:col-span-4');

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className={`${colSpan} group relative bg-white border border-[#E5E3D8] rounded-[32px] overflow-hidden shadow-xs hover:border-[#FF6B2B]/60 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between`}
              >
                {/* Image Container with Dynamic Height */}
                <div className={`relative overflow-hidden ${isHero ? 'h-72 sm:h-96' : 'h-60 sm:h-64'} bg-neutral-900`}>
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#FF6B2B]" />
                      {project.categoryLabel}
                    </span>

                    <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Maximize2 className="w-4 h-4 text-[#111111]" />
                    </span>
                  </div>

                  {/* Overlay Bottom Badge on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-200 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                      {project.highlightBadge}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold mb-1.5">
                      <span className="truncate">{project.client}</span>
                      <span className="text-neutral-400 shrink-0">{project.clientLocation}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-[#111111] leading-snug group-hover:text-[#FF6B2B] transition-colors mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 font-medium line-clamp-2 leading-relaxed mb-3">
                      {project.description}
                    </p>

                    {project.interiorDetails && (
                      <div className="mb-3.5 px-3 py-2 rounded-xl bg-[#FFFDF7] border border-[#E8DFC8]/80 text-[11px] text-neutral-700">
                        <span className="text-[#FF6B2B] font-black block mb-0.5">
                          {project.interiorDetails.title}:
                        </span>
                        <p className="line-clamp-2 text-neutral-600 font-normal leading-relaxed">
                          {project.interiorDetails.items[0]} {project.interiorDetails.items[1]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Micro Specs Footer */}
                  <div className="pt-3 border-t border-[#EAE7DC] flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Layers className="w-3.5 h-3.5 text-[#FF6B2B]" />
                      <span className="truncate max-w-[170px] sm:max-w-[200px]">{project.detailedSpecs.material}</span>
                    </div>
                    
                    <span className="text-[11px] font-black text-[#FF6B2B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform uppercase tracking-wider">
                      Ver Ficha <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Callout Tile: Custom Fabrication Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-12 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#242424] text-white rounded-[32px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-xl relative overflow-hidden"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B] text-white flex items-center justify-center shadow-lg shadow-[#FF6B2B]/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B2B]">
                  Servicio a Medida
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black font-['Outfit'] mb-2 text-white">
                ¿Tenés un diseño o archivo 3D listo para imprimir?
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                Aceptamos archivos .STL, .STEP, .OBJ o bosquejos conceptuales. Te asesoramos en el filamento ideal según el esfuerzo mecánico, temperatura y terminación visual.
              </p>
            </div>

            <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto min-w-[240px]">
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full py-3 px-5 rounded-xl bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider hover:bg-[#E55A1F] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Subir Archivo y Cotizar</span>
              </button>

              <a
                href="https://wa.me/5491100000000?text=Hola%20Thunder%203D!%20Tengo%20un%20proyecto%20para%20imprimir"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Lightbox / Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white border border-[#E5E3D8] rounded-[32px] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Cerrar"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#FF6B2B] text-white flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Main Showcase Image */}
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-[#E5E3D8]">
                  <img 
                    src={selectedProject.mainImage} 
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B2B]" />
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Title & Metadata */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 font-bold mb-2">
                    <span className="text-[#FF6B2B] font-black uppercase tracking-wider">
                      {selectedProject.highlightBadge}
                    </span>
                    <span>
                      {selectedProject.client} • <strong className="text-neutral-700">{selectedProject.clientLocation}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#111111] mb-3">
                    {selectedProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Interior Distribution Callout */}
                {selectedProject.interiorDetails && (
                  <div className="bg-[#FFFDF7] border border-[#E8DFC8] rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FF6B2B]/10 flex items-center justify-center text-[#FF6B2B] shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-[#111111] uppercase tracking-wider font-['Outfit']">
                        {selectedProject.interiorDetails.title}
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {selectedProject.interiorDetails.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B] mt-2 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specs Grid */}
                <div className="bg-[#FDFCF0] border border-[#E5E3D8] rounded-2xl p-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#FF6B2B]" />
                    Ficha Técnica de Fabricación
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Material</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.material}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Resolución de Capa</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.layerHeight}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Relleno (Infill)</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.infill}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Tiempo de Impresión</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.printDuration}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Peso del Modelo</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.weight}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E3D8]">
                      <span className="text-[10px] text-neutral-400 font-black uppercase block">Tecnología</span>
                      <span className="font-bold text-[#111111]">{selectedProject.detailedSpecs.technology}</span>
                    </div>
                  </div>
                </div>

                {/* Client Feedback Snippet */}
                {selectedProject.testimonialSnippet && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                        Resultado & Validación del Cliente
                      </span>
                      <p className="text-xs text-emerald-950 font-semibold italic mt-0.5">
                        "{selectedProject.testimonialSnippet}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EAE7DC]">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setIsCustomModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#111111] text-white hover:bg-[#FF6B2B] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Cotizar con mis especificaciones</span>
                  </button>

                  <button
                    onClick={() => handleConsultProject(selectedProject)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Consultar pieza similar en WhatsApp</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
