import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Quote, 
  MessageSquarePlus, 
  Heart, 
  ThumbsUp, 
  X, 
  Send,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TESTIMONIALS, TESTIMONIALS_METRICS, Testimonial } from '../data/testimonials';
import { useCart } from '../context/CartContext';
import { saveReviewToFirestore, subscribeToReviews } from '../services/db';

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Testimonials: React.FC = () => {
  const { addToast } = useCart();
  const [filter, setFilter] = useState<'all' | 'setup' | 'deco' | 'custom' | 'art'>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = subscribeToReviews((remoteReviews) => {
      if (remoteReviews && remoteReviews.length > 0) {
        setUserTestimonials(remoteReviews);
      }
    });
    return () => unsubscribe();
  }, []);

  const allReviews = [...userTestimonials, ...TESTIMONIALS];

  const filteredReviews = allReviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'setup') return review.purchasedProduct.toLowerCase().includes('gamer') || review.purchasedProduct.toLowerCase().includes('soporte') || review.purchasedProduct.toLowerCase().includes('organizador');
    if (filter === 'deco') return review.purchasedProduct.toLowerCase().includes('maceta') || review.purchasedProduct.toLowerCase().includes('decor');
    if (filter === 'custom') return review.purchasedProduct.toLowerCase().includes('personalizada') || review.purchasedProduct.toLowerCase().includes('cortante') || review.purchasedProduct.toLowerCase().includes('maqueta');
    if (filter === 'art') return review.purchasedProduct.toLowerCase().includes('dragón') || review.purchasedProduct.toLowerCase().includes('figura');
    return true;
  });

  const handleLike = (id: string) => {
    setHelpfulLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    addToast('¡Gracias por tu valoración!', 'info');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      addToast('Por favor completa tu nombre y comentario', 'warning');
      return;
    }

    const reviewPayload: Omit<Testimonial, 'id'> = {
      name: newName.trim(),
      role: 'Cliente Verificado',
      city: newCity.trim() || 'Buenos Aires',
      avatar: '',
      rating: newRating,
      comment: newComment.trim(),
      purchasedProduct: newProduct.trim() || 'Pieza 3D Personalizada',
      productImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      highlightTag: 'Reseña de la Comunidad',
      date: 'Recién publicado',
      verifiedPurchase: true,
      featured: false
    };

    const optimisticReview: Testimonial = {
      id: `user-rev-${Date.now()}`,
      ...reviewPayload
    };

    setUserTestimonials(prev => [optimisticReview, ...prev]);
    setIsReviewModalOpen(false);
    setNewName('');
    setNewCity('');
    setNewComment('');
    setNewProduct('');
    setNewRating(5);
    addToast('¡Tu reseña fue publicada y guardada en Firebase!', 'success');

    await saveReviewToFirestore(reviewPayload);
  };

  return (
    <section id="testimonios" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 text-[#FF6B2B] text-[11px] font-black uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-[#FF6B2B]" />
              <span>Experiencias Reales</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-[#111111] tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl font-medium">
              Más de 480 impresiones 3D entregadas en CABA con máxima satisfacción en calidad, resistencia y terminación.
            </p>
          </div>

          {/* Action to leave review */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#111111] text-white hover:bg-[#FF6B2B] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Dejar Reseña</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
            }`}
          >
            Todas ({allReviews.length})
          </button>
          <button
            onClick={() => setFilter('setup')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === 'setup'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
            }`}
          >
            Setup & Gaming
          </button>
          <button
            onClick={() => setFilter('deco')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === 'deco'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
            }`}
          >
            Hogar & Deco
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === 'custom'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
            }`}
          >
            A Medida & Prototipos
          </button>
          <button
            onClick={() => setFilter('art')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === 'art'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'bg-white border border-[#E5E3D8] text-neutral-700 hover:border-[#FF6B2B]'
            }`}
          >
            Figuras & Colección
          </button>
        </div>

        {/* Bento Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          
          {/* Card 1: Score & Metrics Bento Tile (4 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white border border-[#E5E3D8] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-[#FF6B2B]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                  Resumen General
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </span>
              </div>

              {/* Big Rating Number */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black font-['Outfit'] text-[#111111] tracking-tight">
                  {TESTIMONIALS_METRICS.averageRating.toFixed(1)}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500 font-bold block">
                    Basado en {TESTIMONIALS_METRICS.totalReviews}+ pedidos
                  </span>
                </div>
              </div>

              {/* Star Breakdown Progress Bars */}
              <div className="space-y-2 my-5 pt-4 border-t border-[#EAE7DC]">
                {TESTIMONIALS_METRICS.starBreakdown.map(item => (
                  <div key={item.stars} className="flex items-center gap-3 text-xs font-bold text-neutral-600">
                    <span className="w-12 text-neutral-500 flex items-center gap-1">
                      {item.stars} <Star className="w-3 h-3 fill-neutral-400 text-neutral-400" />
                    </span>
                    <div className="flex-1 h-2 bg-[#F5F3E9] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6B2B] rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-black text-neutral-800">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 border-t border-[#EAE7DC] grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8]">
                <div className="text-sm font-black text-[#111111]">{TESTIMONIALS_METRICS.satisfactionRate}</div>
                <div className="text-[10px] text-neutral-500 font-medium">Satisfacción Total</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8]">
                <div className="text-sm font-black text-[#111111]">{TESTIMONIALS_METRICS.repeatBuyersRate}</div>
                <div className="text-[10px] text-neutral-500 font-medium">Recompran en 30d</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Featured Hero Testimonial (8 cols on lg) */}
          {filteredReviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-8 bg-white border border-[#E5E3D8] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#FF6B2B]/40 transition-colors relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Quote className="w-32 h-32 text-[#111111]" />
              </div>

              <div>
                {/* Top badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 text-[#FF6B2B] text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {filteredReviews[0].highlightTag}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {filteredReviews[0].date}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-[#FFB800] mb-4">
                  {[...Array(filteredReviews[0].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-base sm:text-lg text-[#111111] font-semibold leading-relaxed mb-6 font-['Outfit']">
                  "{filteredReviews[0].comment}"
                </p>
              </div>

              {/* Author and Product details footer */}
              <div className="pt-5 border-t border-[#EAE7DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Profile monogram and identity */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#FF8247] text-white flex items-center justify-center font-black text-base shadow-sm font-['Outfit'] tracking-wider border-2 border-white">
                      {getInitials(filteredReviews[0].name)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#111111] font-['Outfit']">
                      {filteredReviews[0].name}
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">
                      {filteredReviews[0].role} • <span className="text-[#111111] font-semibold">{filteredReviews[0].city}</span>
                    </p>
                  </div>
                </div>

                {/* Product badge */}
                <div className="flex items-center gap-3 bg-[#FDFCF0] border border-[#E5E3D8] p-2.5 rounded-2xl max-w-xs">
                  <img 
                    src={filteredReviews[0].productImage} 
                    alt={filteredReviews[0].purchasedProduct}
                    className="w-9 h-9 rounded-xl object-cover border border-[#E5E3D8]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">
                      Producto Comprado
                    </span>
                    <span className="text-xs font-bold text-[#111111] truncate block">
                      {filteredReviews[0].purchasedProduct}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subsequent Testimonial Bento Cards (Remaining reviews) */}
          {filteredReviews.slice(1).map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.05 }}
              className="lg:col-span-4 bg-white border border-[#E5E3D8] rounded-[32px] p-6 flex flex-col justify-between shadow-xs hover:border-[#FF6B2B]/40 hover:shadow-md transition-all group"
            >
              <div>
                {/* Header: Rating & Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-[#FFB800]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B2B] bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full">
                    {review.highlightTag}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div>
                {/* Purchased product micro strip */}
                <div className="mb-4 p-2 rounded-xl bg-[#FDFCF0] border border-[#E5E3D8] flex items-center gap-2 text-[11px] text-neutral-600 font-medium">
                  <Package className="w-3.5 h-3.5 text-[#FF6B2B] shrink-0" />
                  <span className="truncate font-bold text-[#111111]">{review.purchasedProduct}</span>
                </div>

                {/* Footer with Monogram & Identity */}
                <div className="pt-3 border-t border-[#EAE7DC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#F7F6EE] border-2 border-[#E5E3D8] group-hover:border-[#FF6B2B]/60 text-neutral-800 group-hover:text-[#FF6B2B] flex items-center justify-center font-black text-xs transition-colors font-['Outfit'] tracking-wider">
                        {getInitials(review.name)}
                      </div>
                      {review.verifiedPurchase && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-1 ring-white">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#111111] font-['Outfit']">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-medium">
                        {review.city} • <span className="text-neutral-400">{review.date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-[#FF6B2B] transition-colors p-1.5 rounded-lg hover:bg-[#FDFCF0]"
                    title="Útil"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{(helpfulLikes[review.id] || 0) > 0 ? helpfulLikes[review.id] : ''}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Card: Community Guarantee Callout Bento Tile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-gradient-to-br from-[#111111] to-[#1E1E1E] text-white rounded-[32px] p-6 sm:p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B2B] text-white flex items-center justify-center mb-4 shadow-md shadow-[#FF6B2B]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B2B] block mb-1">
                Garantía Thunder 100%
              </span>
              <h3 className="text-lg font-black font-['Outfit'] mb-2">
                ¿Tu pieza no quedó como esperabas?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                Si un producto presenta algún defecto de extrusión o falla dimensional, te lo reimprimimos o te devolvemos el dinero sin vueltas.
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-bold">Atención personalizada</span>
              <a
                href="https://wa.me/5491100000000?text=Hola%20Thunder%203D!%20Quería%20hacerles%20una%20consulta"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-black text-[#FF6B2B] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Escribir al Taller <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Modal: Dejar Reseña */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-[#E5E3D8] rounded-[32px] shadow-2xl p-6 sm:p-8 z-10"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FDFCF0] border border-[#E5E3D8] flex items-center justify-center text-[#111111] hover:bg-[#FF6B2B] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EAE7DC]">
                <div className="w-11 h-11 rounded-2xl bg-[#FF6B2B] text-white flex items-center justify-center font-black">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-[#111111]">
                    Dejar mi Reseña
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Compartí tu experiencia con la comunidad de Thunder 3D
                  </p>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Rating selection */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                    Calificación general
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            (hoverRating || newRating) >= star
                              ? 'text-[#FFB800] fill-[#FFB800]'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-[#111111] ml-2">
                      {newRating} de 5 estrellas
                    </span>
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Martín Rodríguez"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1">
                      Ciudad / Barrio
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: CABA / Córdoba"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1">
                    Producto o Servicio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Soporte de auricular / Prototipo 3D"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1">
                    Tu Opinión *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Contanos qué te pareció la calidad del filamento, la terminación y la velocidad de entrega..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl p-3.5 text-xs font-medium text-[#111111] focus:outline-none focus:border-[#FF6B2B] resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#FDFCF0] border border-[#E5E3D8] text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF6B2B] text-white text-xs font-black uppercase tracking-wider hover:bg-[#E55A1F] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Reseña</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
