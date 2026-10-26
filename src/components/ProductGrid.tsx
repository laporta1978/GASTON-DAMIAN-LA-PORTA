import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Heart, 
  RotateCcw,
  SlidersHorizontal,
  X,
  Layers
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';

export const ProductGrid: React.FC = () => {
  const { 
    products,
    categories,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    favorites
  } = useCart();

  const [sortBy, setSortBy] = useState<'default' | 'featured' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const defaultFirstCat = categories[0]?.id || 'jarras';
    const isSpecialCat = selectedCategory === 'ofertas' || selectedCategory === 'favoritos';
    const categoryExists = categories.some(c => c.id === selectedCategory);
    const activeCat = (selectedCategory === 'all' || (!isSpecialCat && !categoryExists))
      ? defaultFirstCat
      : selectedCategory;

    return products.filter(product => {
      // Category filter
      if (activeCat === 'ofertas') {
        if (!product.isOffer) return false;
      } else if (activeCat === 'favoritos') {
        if (!favorites.includes(product.id)) return false;
      } else if (product.category !== activeCat) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchCat = product.categoryLabel.toLowerCase().includes(query);
        const matchTags = product.tags?.some(t => t.toLowerCase().includes(query));
        const matchMaterial = product.printMaterial.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat && !matchTags && !matchMaterial) return false;
      }

      // Stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, favorites, onlyInStock, sortBy, categories]);

  const resetAllFilters = () => {
    const firstCat = categories[0]?.id || 'jarras';
    setSelectedCategory(firstCat);
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('default');
  };

  const defaultFirstCat = categories[0]?.id || 'jarras';
  const isSpecialCat = selectedCategory === 'ofertas' || selectedCategory === 'favoritos';
  const categoryExists = categories.some(c => c.id === selectedCategory);
  const effectiveCategory = (selectedCategory === 'all' || (!isSpecialCat && !categoryExists))
    ? defaultFirstCat
    : selectedCategory;
  const currentCategoryObj = categories.find(c => c.id === effectiveCategory);

  const getCategoryHeading = () => {
    if (effectiveCategory === 'ofertas') return 'Ofertas Especiales 10% OFF';
    if (effectiveCategory === 'favoritos') return 'Tus Productos Favoritos';
    if (effectiveCategory === 'jarras') return 'Jarras & Chopps 3D';
    if (effectiveCategory === 'ceramica') return 'Herramientas para Cerámica';
    if (effectiveCategory === 'cortantes') return 'Cortantes de Repostería';
    if (effectiveCategory === 'mate') return 'Mates 3D Térmicos';
    if (effectiveCategory === 'llaveros') return 'Llaveros y Souvenirs 3D';
    if (effectiveCategory === 'botellas-cortadas') return 'Vasos y Botellas Cortadas';
    if (effectiveCategory === 'personalizados') return 'Pedidos Personalizados 3D';
    return currentCategoryObj?.name || 'Catálogo de Productos';
  };

  return (
    <section id="productos" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
              <Sparkles className="w-3.5 h-3.5" />
              {effectiveCategory === 'ofertas' 
                ? 'Ofertas Especiales' 
                : effectiveCategory === 'favoritos' 
                  ? 'Colección Favoritos' 
                  : currentCategoryObj?.name || 'Colección'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#111111]">
              {getCategoryHeading()}
            </h2>
          </div>

          {/* Search bar inside catalog */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar jarras, mates, llaveros, cerámica, cortantes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5E3D8] rounded-full pl-10 pr-10 py-2.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/10 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills / Bento Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          
          <button
            onClick={() => setSelectedCategory('ofertas')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              effectiveCategory === 'ofertas'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 text-[#FF6B2B] hover:bg-[#FF6B2B]/20'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            Ofertas 10% OFF
            <span className="text-[10px] font-bold opacity-80">({products.filter(p => p.isOffer).length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('favoritos')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              effectiveCategory === 'favoritos'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-current text-rose-500' : ''}`} />
            Favoritos
            {favorites.length > 0 && <span className="text-[10px] font-bold">({favorites.length})</span>}
          </button>

          {categories.map(cat => {
            const catCount = products.filter(p => p.category === cat.id).length;
            const isCatActive = effectiveCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCatActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]/50 hover:text-[#FF6B2B]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70 font-semibold">({catCount})</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter & Sort controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAE7DC] text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span>Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'producto' : 'productos'}</span>
            {searchQuery && (
              <span className="bg-[#FF6B2B]/10 text-[#FF6B2B] px-2 py-0.5 rounded-full font-bold text-[11px]">
                Búsqueda: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <label htmlFor="sort-select" className="text-neutral-500 font-medium text-xs">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Ordenar productos por"
                className="bg-white border border-[#E5E3D8] rounded-full px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#FF6B2B]"
              >
                <option value="default">Catálogo General</option>
                <option value="featured">Destacados primero</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="rating">Mejor puntuados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-16 text-center glass-card rounded-3xl p-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-neutral-900 mb-2">
              No encontramos productos
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-normal leading-relaxed">
              Probá cambiando el filtro o la palabra clave en el buscador. ¿Buscás un diseño a medida que no está publicado?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer filtros
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
