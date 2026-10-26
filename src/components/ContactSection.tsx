import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Check, 
  Sparkles, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveContactMessageToFirestore } from '../services/db';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ContactSection: React.FC = () => {
  const { addToast } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSent(true);

    await saveContactMessageToFirestore({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    addToast('¡Mensaje enviado y registrado! Te responderemos en breve.', 'success');
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 3000);
  };

  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/5491100000000?text=Hola%20Thunder%203D!%20Tengo%20una%20consulta%20sobre%20impresiones%203D', '_blank');
  };

  return (
    <section id="contacto" className="py-16 relative bg-[#111111] text-white overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B2B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF8247]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF8247] bg-[#FF6B2B]/20 border border-[#FF6B2B]/30 px-3.5 py-1 rounded-full inline-block mb-3">
            Estamos para ayudarte
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] mb-3 text-white">
            Contactate con Thunder 3D
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            ¿Tenés dudas sobre materiales, cotizaciones  o tiempos de entrega? Escribinos y te asesoramos al instante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Cards: Contact Bento channels */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Bento Card */}
            <div 
              onClick={handleOpenWhatsApp}
              className="p-5 rounded-3xl bg-neutral-900/90 border border-white/10 hover:border-[#25D366]/60 transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-6 h-6 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">WhatsApp</div>
                <div className="text-base font-black text-white font-['Outfit'] mt-0.5">
                  +54 9 11 26718294
                </div>
                <div className="text-xs text-emerald-400 mt-1 font-bold flex items-center gap-1">
                  <span>Respuesta inmediata</span>
                </div>
              </div>
            </div>

            {/* Email Bento Card */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B2B]/20 border border-[#FF6B2B]/40 text-[#FF6B2B] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Correo Electrónico</div>
                <div className="text-base font-black text-white font-['Outfit'] mt-0.5">
                  TONGATHUNDER@GMAIL.COM
                </div>
                <div className="text-xs text-neutral-400 mt-1 font-normal">
                  Para envío de archivos STEP, OBJ, STL 
                </div>
              </div>
            </div>

            {/* Location Bento Card */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF8247]/20 border border-[#FF8247]/40 text-[#FF8247] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Taller & Retiros</div>
                <div className="text-base font-black text-white font-['Outfit'] mt-0.5">
                  Republica de Mataderos, CABA
                </div>
                <div className="text-xs text-neutral-400 mt-1 font-normal">
                  Lunes a Viernes de 10:00 a 15:00 hs
                </div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Bento Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900/90 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm">
              
              <h3 className="text-lg font-black font-['Outfit'] text-white mb-1">
                Envianos tu consulta directa
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Completá el formulario y nuestro equipo de impresión te responderá a la brevedad.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Martínez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111111] border border-neutral-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Email de contacto *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ej: laura@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111111] border border-neutral-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                    ¿En qué podemos ayudarte? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Contanos tu proyecto, medidas, cantidad de piezas o dudas sobre el catálogo..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#111111] border border-neutral-700 rounded-2xl p-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6B2B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sent}
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B2B] hover:bg-[#F25A1B] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF6B2B]/20 active:scale-98 flex items-center justify-center gap-2"
                >
                  {sent ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Mensaje enviado con éxito!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar mensaje al taller
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
