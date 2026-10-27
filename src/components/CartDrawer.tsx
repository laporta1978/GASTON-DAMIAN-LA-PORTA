import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Truck, 
  Check, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CartItem } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    restoreCart,
    subtotal, 
    discount, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    shippingCost,
    selectedShipping,
    setSelectedShipping,
    total,
    whatsappNumber,
    addToast,
    isCartDisabled
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);
  const [recentlyClearedItems, setRecentlyClearedItems] = useState<CartItem[]>([]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
      setCouponError(false);
    } else {
      setCouponError(true);
    }
  };

  const handleManualClearCart = () => {
    if (cart.length === 0) return;
    setRecentlyClearedItems([...cart]);
    clearCart();
    setShowClearConfirm(false);
    addToast('El carrito se ha vaciado correctamente', 'info');
  };

  const handleRestoreCart = () => {
    if (recentlyClearedItems.length > 0) {
      restoreCart(recentlyClearedItems);
      setRecentlyClearedItems([]);
      setOrderSentSuccess(false);
    }
  };

  const handleWhatsAppCartOrder = () => {
    if (cart.length === 0) return;

    // Save snapshot of items in case user wants to restore
    const itemsSnapshot = [...cart];
    setRecentlyClearedItems(itemsSnapshot);

    const phone = whatsappNumber || '5491123456789';
    let msg = `¡Hola Thunder 3D! 👋 Quiero consultar y encargar los siguientes productos de mi carrito:\n\n`;
    
    cart.forEach((item) => {
      msg += `📦 *${item.quantity}x ${item.product.name}*\n`;
      if (item.selectedColor) {
        msg += `   🎨 Color: ${item.selectedColor.name}\n`;
      }
      msg += `   💵 Precio: $${(item.product.price * item.quantity).toLocaleString('es-AR')}\n\n`;
    });

    msg += `------------------------------\n`;
    msg += `Subtotal: $${subtotal.toLocaleString('es-AR')}\n`;
    if (discount > 0) {
      msg += `Descuento (${appliedCoupon?.code}): -$${discount.toLocaleString('es-AR')}\n`;
    }
    const shippingName = selectedShipping === 'caba_express' ? 'Moto Express CABA' : selectedShipping === 'correo_argentino' ? 'Correo Andreani / Nac.' : 'Retiro en Taller';
    msg += `Envío (${shippingName}): ${shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-AR')}`}\n`;
    msg += `💰 *Total Estimado: $${total.toLocaleString('es-AR')}*\n\n`;
    msg += `¿Tienen disponibilidad para coordinar la entrega o retiro? ¡Muchas gracias!`;

    // 1. Open WhatsApp with formatted order message
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');

    // 2. Clear cart immediately as requested
    clearCart();

    // 3. Set order success state and notify user
    setOrderSentSuccess(true);
    addToast('¡Pedido enviado por WhatsApp! El carrito se vació exitosamente.', 'success');
  };

  if (isCartDisabled) {
    return null;
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCartOpen(false);
              setShowClearConfirm(false);
              setOrderSentSuccess(false);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Lateral Bento Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#FDFCF0] border-l border-[#E5E3D8] shadow-2xl flex flex-col justify-between"
            >
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#EAE7DC] bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black font-['Outfit'] text-[#111111] leading-tight">
                        Tu Carrito
                      </h2>
                      <span className="text-[11px] text-neutral-400 font-bold uppercase">
                        {cart.length} {cart.length === 1 ? 'producto' : 'productos'} agregados
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón para vaciar carrito manualmente */}
                    {cart.length > 0 && !showClearConfirm && (
                      <button
                        id="empty-cart-button"
                        onClick={() => setShowClearConfirm(true)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Vaciar todo el carrito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Vaciar</span>
                      </button>
                    )}

                    {/* Botón cerrar */}
                    <button
                      id="close-cart-drawer-button"
                      onClick={() => {
                        setIsCartOpen(false);
                        setShowClearConfirm(false);
                        setOrderSentSuccess(false);
                      }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Cerrar carrito"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Banner de confirmación para vaciar el carrito */}
                {showClearConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs"
                  >
                    <div className="flex items-center gap-2 mb-2 font-black">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>¿Deseas vaciar todos los productos del carrito?</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-neutral-700 hover:bg-neutral-50 text-[11px] font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        id="confirm-empty-cart-button"
                        onClick={handleManualClearCart}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black cursor-pointer shadow-xs"
                      >
                        Sí, vaciar carrito
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                
                {/* 1. VISTA DE ÉXITO LUEGO DE ENVIAR POR WHATSAPP */}
                {orderSentSuccess && cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 px-2 flex flex-col items-center justify-center h-full"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2 inline-block">
                      ¡Pedido Enviado por WhatsApp!
                    </span>

                    <h3 className="text-xl font-black font-['Outfit'] text-[#111111] mb-2">
                      El carrito se vació exitosamente
                    </h3>

                    <p className="text-xs text-neutral-600 mb-5 max-w-xs leading-relaxed">
                      Tu pedido fue transferido a WhatsApp con todos los detalles. Limpiamos tu compra del carrito para que quede listo para tu próximo pedido.
                    </p>

                    {/* Resumen de lo enviado */}
                    {recentlyClearedItems.length > 0 && (
                      <div className="w-full bg-white rounded-2xl p-3.5 border border-[#E5E3D8] text-left text-xs mb-6 shadow-2xs space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                          Resumen del pedido enviado ({recentlyClearedItems.length} {recentlyClearedItems.length === 1 ? 'ítem' : 'ítems'}):
                        </div>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {recentlyClearedItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-neutral-800">
                              <span className="font-bold truncate text-[11px]">
                                {item.quantity}x {item.product.name} ({item.selectedColor.name})
                              </span>
                              <span className="font-mono text-[11px] text-[#FF6B2B] font-black ml-2 shrink-0">
                                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acciones post-envío */}
                    <div className="w-full space-y-2.5">
                      <button
                        onClick={() => {
                          setOrderSentSuccess(false);
                          setIsCartOpen(false);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-[#FF6B2B] text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                      >
                        Aceptar y seguir explorando
                      </button>

                      {recentlyClearedItems.length > 0 && (
                        <button
                          onClick={handleRestoreCart}
                          className="w-full py-2.5 rounded-xl border border-[#E5E3D8] bg-white hover:bg-[#FDFCF0] text-neutral-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                          <span>¿Hubo un error? Deshacer y recuperar productos</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : cart.length > 0 ? (
                  // 2. LISTA DE PRODUCTOS EN EL CARRITO
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor.name}`}
                      className="bg-white rounded-3xl p-4 border border-[#E5E3D8] shadow-xs flex gap-3.5 items-center relative group"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-2xl bg-[#FDFCF0] border border-[#E5E3D8] overflow-hidden shrink-0 aspect-square">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-black font-['Outfit'] text-[#111111] truncate">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Color & Material badge */}
                        <div className="flex items-center gap-2 my-1 text-[11px] text-neutral-500 font-medium">
                          <span className="flex items-center gap-1 font-bold">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                          <span>•</span>
                          <span>{item.product.printMaterial}</span>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[#E5E3D8] rounded-xl bg-[#FDFCF0] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor.name)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-[#E5E3D8] active:scale-95 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor.name)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-[#E5E3D8] active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black font-['Outfit'] text-[#111111]">
                              ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[10px] text-neutral-400">
                                (${item.product.price.toLocaleString('es-AR')} c/u)
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  // 3. CARRITO VACÍO ESTÁNDAR
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-3xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black font-['Outfit'] text-[#111111] mb-1">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                      ¡Agregá productos de nuestro catálogo 3D o configurá un pedido personalizado!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 rounded-2xl bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors cursor-pointer"
                    >
                      Explorar productos
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer & Calculations */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#EAE7DC] bg-white space-y-4">
                  
                  {/* Coupon Form */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                        <div className="flex items-center gap-2 font-bold">
                          <Tag className="w-4 h-4 text-emerald-600" />
                          <span>Cupón "{appliedCoupon.code}" aplicado (-{appliedCoupon.percent}%)</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Cupón de descuento (ej: THUNDER10)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl pl-9 pr-3 py-2 text-xs font-bold uppercase placeholder:normal-case placeholder-neutral-400 focus:outline-none focus:border-[#FF6B2B]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Shipping Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-neutral-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#FF6B2B]" />
                      Método de entrega:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSelectedShipping('caba_express')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedShipping === 'caba_express'
                            ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-[#FF6B2B] font-black'
                            : 'border-[#E5E3D8] bg-[#FDFCF0] text-neutral-600'
                        }`}
                      >
                        <div className="font-bold">Moto CABA</div>
                        <div className="text-neutral-500 font-bold">{subtotal >= 35000 ? 'GRATIS' : '$2.800'}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedShipping('retiro_taller')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedShipping === 'retiro_taller'
                            ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-[#FF6B2B] font-black'
                            : 'border-[#E5E3D8] bg-[#FDFCF0] text-neutral-600'
                        }`}
                      >
                        <div className="font-bold">Retiro Taller</div>
                        <div className="text-emerald-700 font-black">GRATIS</div>
                      </button>
                    </div>
                  </div>

                  {/* Summary Lines */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-[#EAE7DC]">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-bold">${subtotal.toLocaleString('es-AR')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Descuento ({appliedCoupon?.code})</span>
                        <span>-${discount.toLocaleString('es-AR')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-600">
                      <span>Envío</span>
                      <span className="font-bold">
                        {shippingCost === 0 ? <span className="text-emerald-600 font-black uppercase">Gratis</span> : `$${shippingCost.toLocaleString('es-AR')}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black font-['Outfit'] text-[#111111] pt-2 border-t border-[#EAE7DC]">
                      <span>Total estimado</span>
                      <span className="text-xl text-[#FF6B2B] font-black">
                        ${total.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Enviar por WhatsApp & Limpiar Carrito */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      id="cart-whatsapp-order-btn"
                      onClick={handleWhatsAppCartOrder}
                      className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/25 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-5 h-5 fill-white" />
                      <span>Enviar por WhatsApp</span>
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-medium pt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Al enviar, el carrito se vacía automáticamente</span>
                    </div>

                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-1.5 text-xs font-bold text-neutral-400 hover:text-[#111111] transition-colors uppercase tracking-wider cursor-pointer text-center"
                    >
                      Seguir explorando
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
