import React from 'react';
import { 
  Zap, 
  Mail, 
  MapPin, 
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck, 
  ArrowUp,
  ArrowRight,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setCurrentView, setIsAdminOpen, setAdminEditProduct } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    setCurrentView('shop');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#111111] text-[#A1A1AA] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FF6B2B] flex items-center justify-center text-white shadow-md shadow-[#FF6B2B]/25">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black tracking-tight text-xl font-['Outfit'] text-white">
                  THUNDER
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF6B2B]/20 text-[#FF8247] border border-[#FF6B2B]/30">
                  3D
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-normal max-w-sm">
              Especialistas en fabricación aditiva y diseño 3D . Soluciones de impresión en PAL, PLA+, PETG, FLEX hogar, coleccionistas y proyectos personalizados.
            </p>

            {/* Quick Micro Social Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block mb-2.5">
                Redes & Mensajería Directa:
              </span>
              <div className="flex items-center gap-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/5491126718294"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp Thunder 3D"
                  className="w-9 h-9 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 flex items-center justify-center transition-all group hover:scale-105"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/thunder3d"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Thunder 3D"
                  className="w-9 h-9 rounded-xl bg-[#E1306C]/15 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#E1306C] hover:text-white border border-[#E1306C]/30 flex items-center justify-center transition-all group hover:scale-105"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/thunder3d"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook oficial de Thunder 3D"
                  className="w-9 h-9 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 flex items-center justify-center transition-all group hover:scale-105"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:TONGATHUNDER@GMAIL.COM"
                  aria-label="Email de Thunder 3D"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF6B2B] text-neutral-300 hover:text-white border border-white/10 flex items-center justify-center transition-all group hover:scale-105"
                  title="Email"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

          </div>

          {/* Column 2: Empresa (2 cols) */}
          {/* Column 2: Empresa & Más Info (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-white font-['Outfit']">
              Más Info & Empresa
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('nosotros')} className="hover:text-[#FF8247] transition-colors text-left">
                  ¿Quiénes somos?
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('como-comprar')} className="hover:text-[#FF8247] transition-colors text-left">
                  ¿Cómo comprar?
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('faq')} className="hover:text-[#FF8247] transition-colors text-left">
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('mayoristas')} className="hover:text-[#FF8247] transition-colors text-left text-emerald-400 font-bold">
                  Info compras mayoristas
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contacto')} className="hover:text-[#FF8247] transition-colors text-left">
                  Contacto directo
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Catálogo & Especiales (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-white font-['Outfit']">
              Catálogo & Envíos
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('categorias')} className="hover:text-[#FF8247] transition-colors text-left">
                  Explorar Categorías
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('ofertas'); handleNavClick('productos'); }} className="hover:text-[#FF8247] transition-colors text-left">
                  Ofertas Especiales (10% OFF)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('personalizados')} className="hover:text-[#FF8247] transition-colors text-left">
                  Impresión a Medida
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('beneficios')} className="hover:text-[#FF8247] transition-colors text-left">
                  Envíos solamente en CABA (24/48hs)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('testimonios')} className="hover:text-[#FF8247] transition-colors text-left">
                  Opiniones de Clientes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-white font-['Outfit']">
              Contacto & Taller
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.054 22l4.978-1.305A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167a8.136 8.136 0 01-4.29-1.218l-.308-.183-2.96.776.79-2.884-.2-.319A8.135 8.135 0 1112 20.167z" />
                  </svg>
                </div>
                <span>WhatsApp: <strong>+54 9 1126718294</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#FF6B2B] shrink-0 mt-0.5" />
                <span>Email: tongathunder@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B2B] shrink-0 mt-0.5" />
                <span>Republica de Mataderos, CABA, Argentina</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="inline-block text-[10px] font-black uppercase text-[#FF8247] bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 px-2.5 py-1 rounded-full">
                ⚡ Granja 3D Activa 24/7
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} <strong>Thunder 3D Impresiones</strong>. Taller de impresión 3D en Republica de Mataderos, CABA.
            todos los derechos del autor
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setAdminEditProduct(null);
                setIsAdminOpen(true);
              }}
              className="text-[11px] font-bold text-neutral-400 hover:text-[#FF6B2B] flex items-center gap-1 transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
            >
              <Sliders className="w-3 h-3 text-[#FF6B2B]" />
              <span>Panel Stock (Admin)</span>
            </button>

            <span className="text-[11px] text-neutral-400 hidden md:inline-block">
              Hecho con filamentos ecológicos PRINTALOP - GRILON ♻️
            </span>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF6B2B] hover:text-white border border-white/10 flex items-center justify-center transition-all text-neutral-300 hover:scale-105"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
