import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Package, Clock, ShieldCheck, Heart, MapPin, ExternalLink, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchOrderByNumber } from '../services/db';

export const UserModal: React.FC = () => {
  const { isUserModalOpen, setIsUserModalOpen, favorites, setSelectedCategory, setCurrentView, addToast } = useCart();
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isUserModalOpen) return null;

  const handleTrackOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchOrderNumber.trim()) {
      addToast('Ingresá el número de pedido (ej: TH-123456)', 'warning');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const order = await fetchOrderByNumber(searchOrderNumber.trim());
      setSearchedOrder(order);
      if (!order) {
        addToast('No se encontró ningún pedido con ese código', 'info');
      } else {
        addToast('¡Pedido encontrado!', 'success');
      }
    } catch (err) {
      addToast('Error al consultar el pedido en la base de datos', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsUserModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Floating mobile close button */}
      <button
        type="button"
        onClick={() => setIsUserModalOpen(false)}
        aria-label="Cerrar ventana"
        className="sm:hidden fixed top-3 right-3 z-[60] w-10 h-10 rounded-full bg-[#111111] text-white border-2 border-white/30 flex items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border border-[#E5E3D8] rounded-[28px] sm:rounded-[32px] shadow-2xl p-5 sm:p-6 z-10 my-auto max-h-[94dvh] sm:max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => setIsUserModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FDFCF0] border border-[#E5E3D8] flex items-center justify-center text-[#111111] hover:bg-[#FF6B2B] hover:text-white shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EAE7DC]">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B2B] text-white flex items-center justify-center font-black text-lg shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black font-['Outfit'] text-[#111111] leading-tight">
              Panel de Cliente & Pedidos
            </h2>
            <span className="text-xs text-neutral-500 font-medium">Thunder 3D Impresiones</span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Active Orders Tracker with Firestore */}
          <div className="p-4 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8]">
            <div className="flex items-center justify-between font-black text-[#111111] mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Package className="w-4 h-4 text-[#FF6B2B]" />
                Seguimiento en Base de Datos
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full font-black uppercase">
                Firebase Firestore
              </span>
            </div>
            <p className="text-neutral-600 text-[11px] mb-3 font-medium">
              Consultá el estado y detalle de tu orden en tiempo real:
            </p>
            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: #TH-284910 o TH-284910"
                className="flex-1 bg-white border border-[#E5E3D8] rounded-xl px-3 py-2 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 rounded-xl bg-[#111111] text-white font-black text-xs uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Buscar</span>
              </button>
            </form>

            {/* Found Order Card */}
            {hasSearched && searchedOrder && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#111111] text-xs">{searchedOrder.orderNumber}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {searchedOrder.status === 'en_produccion' ? 'En Impresión 3D' : searchedOrder.status || 'En Proceso'}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600 space-y-1 pt-1 border-t border-neutral-100">
                  <div><strong>Cliente:</strong> {searchedOrder.customer?.name}</div>
                  <div><strong>Total:</strong> ${Number(searchedOrder.total).toLocaleString('es-AR')}</div>
                  <div><strong>Pago:</strong> {searchedOrder.paymentMethod}</div>
                  {searchedOrder.items && searchedOrder.items.length > 0 && (
                    <div className="text-[10px] text-neutral-500">
                      <strong>Piezas:</strong> {searchedOrder.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasSearched && !searchedOrder && !isSearching && (
              <div className="mt-3 p-3 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>No encontramos ninguna orden con ese código. ¿Querés consultarnos por WhatsApp?</span>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setIsUserModalOpen(false);
                setSelectedCategory('favoritos');
                setCurrentView('shop');
                setTimeout(() => {
                  const el = document.getElementById('productos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="p-3.5 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8] text-left hover:border-rose-300 hover:bg-white transition-all flex flex-col justify-between"
            >
              <Heart className="w-4 h-4 text-rose-500 mb-1" />
              <div>
                <div className="font-black text-[#111111] text-xs">Mis Favoritos</div>
                <div className="text-[10px] text-neutral-500 font-medium">{favorites.length} guardados</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsUserModalOpen(false);
                window.open('https://wa.me/5491100000000', '_blank');
              }}
              className="p-3.5 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8] text-left hover:border-emerald-300 hover:bg-white transition-all flex flex-col justify-between"
            >
              <Clock className="w-4 h-4 text-emerald-500 mb-1" />
              <div>
                <div className="font-black text-[#111111] text-xs">Soporte 24/7</div>
                <div className="text-[10px] text-neutral-500 font-medium">Atención WhatsApp</div>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsUserModalOpen(false)}
            className="w-full py-2.5 rounded-2xl border border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-neutral-500" />
            <span>Cerrar ventana</span>
          </button>

        </div>

      </motion.div>
    </div>
  );
};
