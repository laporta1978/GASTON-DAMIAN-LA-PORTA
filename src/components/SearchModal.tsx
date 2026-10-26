import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Flame, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const SearchModal: React.FC = () => {
  const { products, isSearchOpen, setIsSearchOpen, setQuickViewProduct, setSelectedCategory } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const popularTags = ['Chopp Vikingo', 'Mate Térmico', 'Llaveros 3D', 'Botellas Cortadas', 'Sellos Cerámica', 'Estecas', 'Cortantes Galletitas', 'Personalizados'];

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q)) ||
      p.printMaterial.toLowerCase().includes(q)
    );
  }, [products, searchTerm]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: any) => {
    setIsSearchOpen(false);
    setQuickViewProduct(product);
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Search Container */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white border border-[#E5E3D8] rounded-[32px] shadow-2xl overflow-hidden z-10 p-6"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#EAE7DC] pb-4">
          <Search className="w-5 h-5 text-[#FF6B2B] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por nombre, categoría, material (ej: PLA, gamer)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-black text-[#111111] placeholder-neutral-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-3.5 py-1.5 rounded-xl bg-[#FDFCF0] border border-[#E5E3D8] text-[#111111] hover:bg-[#FF6B2B] hover:text-white text-xs font-black uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Popular searches suggestions when empty */}
        {!searchTerm && (
          <div className="pt-4 pb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
              Búsquedas frecuentes:
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FDFCF0] border border-[#E5E3D8] text-[#111111] hover:border-[#FF6B2B] hover:text-[#FF6B2B] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Autocomplete Suggestions Bar */}
        {searchTerm && results.length > 0 && (
          <div className="pt-3 pb-2 border-b border-[#F0EFE6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B2B] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Autocompletado sugerido:
              </span>
              <span className="text-[11px] font-bold text-neutral-400">
                {results.length} {results.length === 1 ? 'coincidencia' : 'coincidencias'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {results.slice(0, 5).map(prod => (
                <button
                  key={`auto-${prod.id}`}
                  onClick={() => setSearchTerm(prod.name)}
                  title="Completar búsqueda"
                  className="px-3 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B2B] border border-orange-200/60 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Search className="w-3 h-3 shrink-0 opacity-70" />
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">{prod.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {searchTerm && (
          <div className="mt-4 max-h-96 overflow-y-auto space-y-2 pr-1">
            {results.length > 0 ? (
              results.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="p-3.5 rounded-2xl bg-[#FDFCF0] hover:bg-white border border-[#E5E3D8] hover:border-[#FF6B2B] hover:shadow-md flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E3D8] overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs sm:text-sm font-black text-[#111111] font-['Outfit'] truncate group-hover:text-[#FF6B2B] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                        <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">{product.categoryLabel}</span>
                        <span>•</span>
                        <span>{product.printMaterial}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <div className="text-sm font-black font-['Outfit'] text-[#111111]">
                      ${product.price.toLocaleString('es-AR')}
                    </div>
                    <span className="text-[10px] text-[#FF6B2B] font-black uppercase tracking-wider group-hover:underline flex items-center gap-1 justify-end">
                      Ver detalle <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-neutral-500 font-medium">
                No encontramos productos para "<span className="font-bold text-[#111111]">{searchTerm}</span>".
              </div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};
