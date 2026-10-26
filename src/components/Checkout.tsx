import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MessageCircle, 
  ShoppingBag, 
  User, 
  MapPin, 
  FileText, 
  Copy, 
  Check, 
  Zap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerInfo } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { 
  EfectivoIcon, 
  DepositoBancarioIcon, 
  MercadoPagoCardIcon, 
  AConvenirIcon,
  PaymentMethodsBanner 
} from './PaymentLogos';

export const Checkout: React.FC = () => {
  const { 
    cart, 
    subtotal, 
    discount, 
    shippingCost, 
    selectedShipping, 
    setSelectedShipping, 
    total, 
    appliedCoupon,
    placeOrder, 
    lastOrder, 
    resetOrder, 
    setCurrentView,
    addToast
  } = useCart();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    dni: '',
    street: '',
    number: '',
    floorApt: '',
    neighborhood: 'Palermo',
    city: 'Ciudad Autónoma de Buenos Aires',
    postalCode: '1425',
    deliveryMethod: selectedShipping,
    paymentMethod: 'mercadopago',
    orderNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCbu, setCopiedCbu] = useState(false);

  const cabaNeighborhoods = [
    'Palermo', 'Belgrano', 'Caballito', 'Almagro', 'Recoleta', 'Villa Crespo', 
    'Colegiales', 'Núñez', 'Flores', 'Villa Urquiza', 'San Telmo', 'Microcentro',
    'Barracas', 'Chacarita', 'Parque Patricios', 'Otro barrio de CABA / GBA'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (method: 'caba_express' | 'correo_argentino' | 'retiro_taller') => {
    setSelectedShipping(method);
    setFormData(prev => ({ ...prev, deliveryMethod: method }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email) {
      addToast('Por favor completá los datos de contacto', 'warning');
      return;
    }

    if (formData.deliveryMethod !== 'retiro_taller' && (!formData.street || !formData.number)) {
      addToast('Por favor completá la dirección de entrega', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder(formData);
      setIsSubmitting(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 1200);
  };

  const handleCopyCbu = () => {
    navigator.clipboard.writeText('0000003100012345678901');
    setCopiedCbu(true);
    addToast('CBU copiado al portapapeles', 'success');
    setTimeout(() => setCopiedCbu(false), 2500);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!lastOrder) return;
    const itemsList = lastOrder.items
      .map(i => `• ${i.quantity}x ${i.product.name} (${i.selectedColor.name}) - $${(i.product.price * i.quantity).toLocaleString('es-AR')}`)
      .join('\n');

    const msg = encodeURIComponent(
      `¡Hola Thunder 3D Impresiones! 👋 Acabo de confirmar mi pedido:\n\n` +
      `🔖 *Orden:* #${lastOrder.orderNumber}\n` +
      `👤 *Cliente:* ${lastOrder.customer.fullName}\n` +
      `📱 *Tel:* ${lastOrder.customer.phone}\n` +
      `📍 *Entrega:* ${lastOrder.customer.deliveryMethod === 'retiro_taller' ? 'Retiro en Taller' : `${lastOrder.customer.street} ${lastOrder.customer.number}, ${lastOrder.customer.neighborhood}, ${lastOrder.customer.city}`}\n\n` +
      `📦 *Detalle del Pedido:*\n${itemsList}\n\n` +
      `💳 *Método de Pago:* ${lastOrder.paymentMethod}\n` +
      `💰 *Total:* $${lastOrder.total.toLocaleString('es-AR')}\n\n` +
      `Por favor confírmenme el inicio de la producción 3D. ¡Muchas gracias!`
    );

    window.open(`https://wa.me/5491100000000?text=${msg}`, '_blank');
  };

  // SUCCESS VIEW
  if (lastOrder) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E5E3D8] shadow-sm text-center"
        >
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-3.5 py-1 rounded-full inline-block mb-3">
            ¡Pedido Confirmado con Éxito!
          </span>

          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#111111] mb-2">
            Gracias por tu compra, {lastOrder.customer.fullName.split(' ')[0]}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 mb-8 max-w-md mx-auto">
            Hemos registrado tu orden <strong className="text-[#111111] font-mono">#{lastOrder.orderNumber}</strong>. En breve comenzaremos la calibración e impresión en nuestro taller.
          </p>

          {/* Order Summary Box */}
          <div className="bg-[#FDFCF0] rounded-2xl p-5 border border-[#E5E3D8] text-left text-xs mb-8 space-y-3">
            <div className="flex justify-between pb-3 border-b border-[#EAE7DC] font-bold text-[#111111]">
              <span>Fecha: {lastOrder.date}</span>
              <span className="text-[#FF6B2B] font-black">Estado: En Producción 3D</span>
            </div>

            <div className="space-y-2">
              {lastOrder.items.map(item => (
                <div key={`${item.product.id}-${item.selectedColor.name}`} className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111111]">{item.quantity}x {item.product.name}</span>
                    <span className="text-[11px] text-neutral-500 block">Color: {item.selectedColor.name} | {item.product.printMaterial}</span>
                  </div>
                  <span className="font-black text-[#111111]">
                    ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EAE7DC] space-y-1">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${lastOrder.subtotal.toLocaleString('es-AR')}</span>
              </div>
              {lastOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Descuento aplicado</span>
                  <span>-${lastOrder.discount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Envío</span>
                <span>{lastOrder.shippingCost === 0 ? 'Gratis' : `$${lastOrder.shippingCost.toLocaleString('es-AR')}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-[#EAE7DC]">
                <span>Total Abonado / A Abonar</span>
                <span className="text-[#FF6B2B] text-base font-black">${lastOrder.total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              <strong>Método de Pago:</strong> {lastOrder.paymentMethod} • <strong>Destino:</strong> {lastOrder.customer.deliveryMethod === 'retiro_taller' ? 'Retiro en Taller Thunder 3D (CABA)' : `${lastOrder.customer.street} ${lastOrder.customer.number}, ${lastOrder.customer.neighborhood}`}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleSendWhatsAppConfirmation}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Notificar / Enviar pedido a WhatsApp
            </button>

            <button
              onClick={resetOrder}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#111111] hover:bg-[#FF6B2B] text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              Volver a la tienda
            </button>
          </div>

        </motion.div>
      </div>
    );
  }

  // EMPTY CART CHECKOUT GUARD
  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black font-['Outfit'] text-[#111111] mb-2">
          No hay productos para el checkout
        </h2>
        <p className="text-xs text-neutral-500 mb-6 font-normal">
          Agregá artículos a tu carrito para continuar con el proceso de compra.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 rounded-2xl bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  // MAIN CHECKOUT FORM
  return (
    <div className="py-8 sm:py-12 relative bg-[#FDFCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Title */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-600 hover:text-[#FF6B2B] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </button>
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#111111]">
            Finalizar Pedido
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Completá tus datos para coordinar la entrega y el pago de tus impresiones 3D.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customer Details, Address, Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Section 1: Customer Info */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E3D8] shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#EAE7DC]">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black font-['Outfit'] text-[#111111] uppercase tracking-wider">
                    1. Datos de Contacto
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ej: Tomás Gómez"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ej: 11 5555 4444"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                      Email de Confirmación *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Ej: usuario@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                      DNI / CUIT (para factura)
                    </label>
                    <input
                      type="text"
                      name="dni"
                      placeholder="Ej: 38.450.123"
                      value={formData.dni}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Method & Address */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E3D8] shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#EAE7DC]">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black font-['Outfit'] text-[#111111] uppercase tracking-wider">
                    2. Método y Dirección de Entrega
                  </h2>
                </div>

                {/* Delivery Method Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => handleShippingChange('caba_express')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.deliveryMethod === 'caba_express'
                        ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 ring-1 ring-[#FF6B2B]'
                        : 'border-[#E5E3D8] bg-[#FDFCF0] hover:border-neutral-400'
                    }`}
                  >
                    <div className="font-black text-xs text-[#111111] mb-0.5">Moto CABA Express</div>
                    <div className="text-[11px] text-neutral-500 font-medium">24/48 hs en Capital Federal</div>
                    <div className="text-xs font-black text-[#FF6B2B] mt-1">
                      {subtotal >= 35000 ? 'GRATIS' : '$2.800'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShippingChange('retiro_taller')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.deliveryMethod === 'retiro_taller'
                        ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 ring-1 ring-[#FF6B2B]'
                        : 'border-[#E5E3D8] bg-[#FDFCF0] hover:border-neutral-400'
                    }`}
                  >
                    <div className="font-black text-xs text-[#111111] mb-0.5">Retiro en Taller</div>
                    <div className="text-[11px] text-neutral-500 font-medium">Palermo / Almagro CABA</div>
                    <div className="text-xs font-black text-emerald-600 mt-1">GRATIS</div>
                  </button>
                </div>

                {/* Address Fields (only if delivery) */}
                {formData.deliveryMethod !== 'retiro_taller' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-8">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Calle / Avenida *
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        placeholder="Ej: Av. Santa Fe"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="number"
                        required
                        placeholder="Ej: 3450"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Piso / Depto
                      </label>
                      <input
                        type="text"
                        name="floorApt"
                        placeholder="Ej: 4to B"
                        value={formData.floorApt}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Barrio (CABA) / Localidad
                      </label>
                      <select
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      >
                        {cabaNeighborhoods.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Ej: 1425"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      />
                    </div>

                    <div className="sm:col-span-12">
                      <label className="font-bold text-neutral-700 block mb-1 text-[11px] uppercase tracking-wider">
                        Indicaciones para el repartidor (Opcional)
                      </label>
                      <input
                        type="text"
                        name="orderNotes"
                        placeholder="Ej: Tocar timbre 4B, dejar en recepción..."
                        value={formData.orderNotes}
                        onChange={handleInputChange}
                        className="w-full bg-[#FDFCF0] border border-[#E5E3D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF6B2B]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black mb-0.5">Punto de retiro: Taller Thunder 3D</div>
                      <div>Av. Córdoba 4500 (esq. Scalabrini Ortiz), Palermo, CABA.</div>
                      <div className="text-[11px] text-emerald-700 mt-1 font-medium">Horarios: Lunes a Viernes de 10:00 a 19:00 hs. Te avisaremos por WhatsApp cuando tu pieza esté lista.</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E3D8] shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#EAE7DC]">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B2B]/10 text-[#FF6B2B] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black font-['Outfit'] text-[#111111] uppercase tracking-wider">
                    3. Medio de Pago
                  </h2>
                </div>

                <div className="space-y-3">
                  
                  {/* Mercado Pago Option */}
                  <label className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'mercadopago'
                      ? 'border-[#0D7E66] bg-[#0D7E66]/10 ring-1 ring-[#0D7E66]'
                      : 'border-[#E5E3D8] bg-[#FDFCF0] hover:border-neutral-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mercadopago"
                          checked={formData.paymentMethod === 'mercadopago'}
                          onChange={handleInputChange}
                          className="text-[#0D7E66] focus:ring-[#0D7E66]"
                        />
                        <div className="w-9 h-9 rounded-xl bg-[#0D7E66]/15 text-[#0D7E66] flex items-center justify-center shrink-0">
                          <MercadoPagoCardIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-[#111111] flex items-center gap-2">
                            <span>Mercado Pago</span>
                            <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-black uppercase">
                              Dinero en Cuenta / Tarjeta / QR
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-medium">
                            Dinero disponible en cuenta y transferencias CVU/QR.
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#111111]">
                        ${total.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </label>

                  {/* Transfer Option with Extra 10% */}
                  <label className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'transferencia'
                      ? 'border-[#0D7E66] bg-[#0D7E66]/10 ring-1 ring-[#0D7E66]'
                      : 'border-[#E5E3D8] bg-[#FDFCF0] hover:border-neutral-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="transferencia"
                          checked={formData.paymentMethod === 'transferencia'}
                          onChange={handleInputChange}
                          className="text-[#0D7E66] focus:ring-[#0D7E66]"
                        />
                        <div className="w-9 h-9 rounded-xl bg-[#0D7E66]/15 text-[#0D7E66] flex items-center justify-center shrink-0">
                          <DepositoBancarioIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-[#111111] flex items-center gap-2">
                            <span>Depósito / Transferencia Bancaria</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">
                              10% EXTRA OFF
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-medium">
                            Transferí y enviá el comprobante por WhatsApp.
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600">
                        ${Math.round(total * 0.9).toLocaleString('es-AR')}
                      </span>
                    </div>

                    {formData.paymentMethod === 'transferencia' && (
                      <div className="mt-3 pt-3 border-t border-[#E5E3D8] text-xs text-neutral-700 bg-white p-3 rounded-2xl">
                        <div className="font-black mb-1 text-[#111111]">Datos Bancarios Thunder 3D:</div>
                        <div className="flex items-center justify-between font-mono bg-[#FDFCF0] p-2 rounded-xl text-[11px] border border-[#E5E3D8]">
                          <span>CBU: 0000003100012345678901</span>
                          <button
                            type="button"
                            onClick={handleCopyCbu}
                            className="text-[#FF6B2B] font-bold hover:underline flex items-center gap-1"
                          >
                            {copiedCbu ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            Copiar
                          </button>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 font-medium">Alias: THUNDER.3D.MP • Banco Santander</div>
                      </div>
                    )}
                  </label>

                  {/* Cash Option */}
                  <label className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'efectivo'
                      ? 'border-[#0D7E66] bg-[#0D7E66]/10 ring-1 ring-[#0D7E66]'
                      : 'border-[#E5E3D8] bg-[#FDFCF0] hover:border-neutral-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="efectivo"
                          checked={formData.paymentMethod === 'efectivo'}
                          onChange={handleInputChange}
                          className="text-[#0D7E66] focus:ring-[#0D7E66]"
                        />
                        <div className="w-9 h-9 rounded-xl bg-[#0D7E66]/15 text-[#0D7E66] flex items-center justify-center shrink-0">
                          <EfectivoIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-[#111111]">
                            Efectivo al recibir / retirar
                          </div>
                          <div className="text-[11px] text-neutral-500 font-medium">
                            Abonás en mano al mensajero (exclusivo CABA) o en el taller.
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#111111]">
                        ${total.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E3D8] shadow-xs">
                
                <h2 className="text-base font-black font-['Outfit'] text-[#111111] pb-3 mb-4 border-b border-[#EAE7DC] flex items-center justify-between">
                  <span>Resumen del Pedido</span>
                  <span className="text-xs font-bold text-neutral-400 uppercase">({cart.length} productos)</span>
                </h2>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-4 text-xs">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.selectedColor.name}`} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#FDFCF0] border border-[#E5E3D8] overflow-hidden shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <span className="font-black text-[#111111] block truncate">{item.quantity}x {item.product.name}</span>
                          <span className="text-[10px] text-neutral-500 font-medium">{item.selectedColor.name}</span>
                        </div>
                      </div>
                      <span className="font-black text-[#111111] shrink-0">
                        ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-[#EAE7DC]">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold">${subtotal.toLocaleString('es-AR')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento cupón ({appliedCoupon?.code})</span>
                      <span>-${discount.toLocaleString('es-AR')}</span>
                    </div>
                  )}

                  {formData.paymentMethod === 'transferencia' && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento Transferencia (-10%)</span>
                      <span>-${Math.round(total * 0.1).toLocaleString('es-AR')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Envío</span>
                    <span className="font-bold">
                      {shippingCost === 0 ? <span className="text-emerald-600 font-black uppercase">Gratis</span> : `$${shippingCost.toLocaleString('es-AR')}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-black font-['Outfit'] text-[#111111] pt-3 border-t border-[#EAE7DC]">
                    <span>Total a Pagar</span>
                    <span className="text-[#FF6B2B] text-2xl font-black">
                      ${(formData.paymentMethod === 'transferencia' ? Math.round(total * 0.9) : total).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Confirm Order CTA */}
                <button
                  id="checkout-confirm-order-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 rounded-2xl bg-[#111111] hover:bg-[#FF6B2B] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando pedido...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-[#FF8247]" />
                      <span>Confirmar Pedido 3D</span>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Compra 100% segura • Garantía de impresión Thunder 3D</span>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
