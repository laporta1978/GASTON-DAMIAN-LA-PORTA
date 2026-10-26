import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Key, 
  Wrench, 
  ArrowUpRight, 
  Coffee, 
  Palette, 
  Cookie, 
  Flame, 
  Wine
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Categories: React.FC = () => {
  const { categories, products, setSelectedCategory, selectedCategory } = useCart();

  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Key,
    Wrench,
    Coffee,
    Palette,
    Cookie,
    Flame,
    Wine
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const el = document.getElementById('productos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categorias" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B]" />
              Catálogo Especializado
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#111111]">
              Explorá nuestras colecciones
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal">
              Encontrá piezas listas para usar o seleccioná una colección para personalizar modelos a escala, colores y filamentos.
            </p>
          </div>
        </div>

        {/* Categories Bento Modular Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            const IconComponent = iconMap[cat.iconName] || Sparkles;
            const isSelected = selectedCategory === cat.id;
            const categoryCount = products.filter(p => p.category === cat.id).length;

            return (
              <motion.button
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`relative group rounded-3xl overflow-hidden text-left border transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[#FF6B2B] shadow-lg shadow-[#FF6B2B]/15 border-[#FF6B2B]'
                    : 'border-[#E5E3D8] bg-white hover:border-[#FF6B2B]/50 hover:shadow-md'
                }`}
              >
                {/* Image Container with Zoom */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/25 to-transparent" />
                  
                  {/* Category Icon Pill in Corner */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#FF6B2B] shadow-sm">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Arrow Icon in Corner */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base sm:text-lg font-black font-['Outfit'] leading-tight mb-0.5">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-neutral-300 font-medium flex items-center gap-1">
                      {categoryCount} {categoryCount === 1 ? 'modelo disponible' : 'modelos disponibles'}
                    </span>
                  </div>
                </div>

                {/* Card Sub-text */}
                <div className="p-3.5 bg-white flex items-center justify-between text-xs border-t border-[#EAE7DC]/60">
                  <span className="text-neutral-500 line-clamp-1 font-medium text-[11px]">
                    {cat.description}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

