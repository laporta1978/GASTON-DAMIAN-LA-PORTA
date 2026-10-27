import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Star, 
  Flame,
  Layers, 
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite, setQuickViewProduct, isStockDisabled, whatsappNumber, addToCart, setIsCartOpen, isCartDisabled } = useCart();
  const favorite = isFavorite(product.id);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = whatsappNumber || '5491123456789';
    const msg = encodeURIComponent(
      `¡Hola Thunder 3D! 👋 Quiero encargar el siguiente producto impreso en 3D:\n\n` +
      `📦 *${product.name}*\n` +
      `💰 Precio: $${product.price.toLocaleString('es-AR')}\n` +
      `🧪 Material: ${product.printMaterial}\n` +
      `📏 Dimensiones: ${product.dimensions}\n\n` +
      `¿Tienen tiempo de producción estimado para encargar ahora? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={() => setQuickViewProduct(product)}
      className="bg-white rounded-3xl overflow-hidden border border-[#E5E3D8] hover:border-[#FF6B2B]/60 hover:shadow-md hover:shadow-[#FF6B2B]/5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full bg-[#FDFCF0] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isOffer && (
              <span className="inline-flex items-center gap-1 bg-[#FF6B2B] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                <Flame className="w-3 h-3 fill-white" />
                {product.discountPercent || 10}% OFF
              </span>
            )}
            
            {/* Stock badge indicator: When isStockDisabled is active, shows Fabricación a Demanda / Pedir por WhatsApp */}
            {isStockDisabled || product.onDemandOnly ? (
              <span className="inline-flex items-center gap-1 bg-[#25D366]/95 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                <WhatsAppIcon className="w-3 h-3 fill-white" />
                A Demanda
              </span>
            ) : !product.inStock || product.stockCount === 0 ? (
              <span className="inline-flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Bajo Demanda
              </span>
            ) : product.stockCount && product.stockCount <= 5 ? (
              <span className="inline-flex items-center gap-1 bg-amber-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                ¡Últimas {product.stockCount} un.!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                En Stock ({product.stockCount ?? 10}u)
              </span>
            )}

            <span className="inline-flex items-center gap-1 bg-[#111111]/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Layers className="w-2.5 h-2.5 text-[#FF6B2B]" />
              {product.printMaterial}
            </span>
          </div>

          {/* Action buttons on image */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            
            {/* Favorite button */}
            <button
              id={`fav-btn-${product.id}`}
              onClick={handleToggleFavorite}
              aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-xs flex items-center justify-center text-neutral-600 hover:text-rose-600 hover:bg-white transition-all active:scale-90"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              aria-label="Vista rápida"
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-xs flex items-center justify-center text-neutral-600 hover:text-[#FF6B2B] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Content Details */}
        <div className="p-4">
          
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-black font-['Outfit'] text-[#111111] line-clamp-1 group-hover:text-[#FF6B2B] transition-colors mb-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-neutral-500 line-clamp-2 font-normal leading-relaxed mb-3">
            {product.description}
          </p>

        </div>

      </div>

      {/* Footer: Price & WhatsApp Action */}
      <div className="px-4 pb-4 pt-3 border-t border-[#EAE7DC] flex items-center justify-between">
        
        {/* Prices */}
        <div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base sm:text-lg font-black font-['Outfit'] text-[#111111]">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through font-semibold">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Add to Cart (hidden when cart is disabled) */}
          {!isCartDisabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
                setIsCartOpen(true);
              }}
              title="Agregar al carrito"
              aria-label="Agregar al carrito"
              className="px-2.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 bg-[#FF6B2B]/10 hover:bg-[#FF6B2B] text-[#FF6B2B] hover:text-white shadow-2xs active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Carrito</span>
            </button>
          )}

          {/* WhatsApp Consultation Action Button */}
          <button
            id={`order-btn-${product.id}`}
            onClick={handleWhatsAppOrder}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs bg-[#111111] text-white hover:bg-[#25D366] active:scale-95 group/btn cursor-pointer ${
              isCartDisabled ? 'px-4 bg-[#25D366] hover:bg-[#20bd5a]' : ''
            }`}
          >
            <WhatsAppIcon className={`w-3.5 h-3.5 fill-current ${isCartDisabled ? 'text-white' : 'text-[#25D366] group-hover/btn:text-white'}`} />
            <span>Consultar</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
};
