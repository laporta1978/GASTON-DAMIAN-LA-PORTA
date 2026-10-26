import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  Heart, 
  ShoppingCart,
  Menu, 
  X, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ChevronDown, 
  Layers,
  HelpCircle,
  ShoppingBag,
  Store,
  PhoneCall,
  Users,
  Info,
  MessageSquare
} from 'lucide-react';
import { useCart } from '../context/CartContext';


export const Header: React.FC = () => {
  const { 
    products,
    categories,
    setIsSearchOpen, 
    favorites,
    currentView,
    setCurrentView,
    setSelectedCategory,
    totalItems,
    setIsCartOpen
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [moreInfoDropdownOpen, setMoreInfoDropdownOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    setServicesDropdownOpen(false);
    setMoreInfoDropdownOpen(false);
    
    if (currentView !== 'shop') {
      setCurrentView('shop');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setProductsDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNavClick('productos');
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFCF0]/90 backdrop-blur-xl border-b border-[#E5E3D8] shadow-sm py-3'
          : 'bg-[#FDFCF0] border-b border-[#EAE7DC] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button
            id="brand-logo-button"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B2B] to-[#F25A1B] flex items-center justify-center shadow-md shadow-[#FF6B2B]/25 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-xl font-['Outfit'] text-[#111111]">
                  THUNDER
                </span>
                <span className="text-xs font-black uppercase px-1.5 py-0.5 rounded bg-[#FF6B2B]/10 text-[#FF6B2B] border border-[#FF6B2B]/20">
                  3D
                </span>
              </div>
              <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 uppercase block -mt-0.5">
                IMPRESIONES
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E5E3D8]">
            <button
              id="nav-link-inicio"
              onClick={() => handleNavClick('hero')}
              className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-white rounded-full transition-all"
            >
              Inicio
            </button>
            
            {/* Productos & Categorías Dropdown Unificado */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                id="nav-link-productos"
                onClick={() => {
                  setSelectedCategory('all');
                  handleNavClick('productos');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  productsDropdownOpen 
                    ? 'text-[#FF6B2B] bg-white shadow-xs' 
                    : 'text-neutral-700 hover:text-[#FF6B2B] hover:bg-white'
                }`}
              >
                Productos
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-[#FF6B2B]' : ''}`} />
              </button>

              <AnimatePresence>
                {productsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl z-50 border border-[#E5E3D8]"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {/* Ofertas destacadas */}
                      <button
                        onClick={() => {
                          setSelectedCategory('ofertas');
                          setProductsDropdownOpen(false);
                          handleNavClick('productos');
                        }}
                        className="flex items-center justify-between px-3 py-2 text-xs font-black text-[#FF6B2B] bg-[#FF6B2B]/10 hover:bg-[#FF6B2B]/20 rounded-xl transition-all text-left group border border-[#FF6B2B]/20 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-[#FF6B2B] fill-[#FF6B2B]" />
                          Ofertas Especiales
                        </span>
                        <span className="text-[10px] font-extrabold bg-[#FF6B2B] text-white px-1.5 py-0.5 rounded-md shadow-xs">
                          10% OFF
                        </span>
                      </button>

                      <div className="h-px bg-neutral-200/60 my-1 mx-2" />

                      {/* Lista de Colecciones */}
                      {categories.map(cat => {
                        const productCount = products.filter(p => p.category === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              handleCategorySelect(cat.id);
                              setProductsDropdownOpen(false);
                            }}
                            className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B] opacity-0 group-hover:opacity-100 transition-opacity" />
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-bold bg-[#E9E8E0] px-1.5 py-0.5 rounded-md group-hover:bg-[#FF6B2B]/10 group-hover:text-[#FF6B2B] transition-colors">
                              {productCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SERVICIO DROPDOWN (A Medida, Opiniones) */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                id="nav-link-servicio"
                className="px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-white rounded-full transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Servicio
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#FF6B2B]' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl z-50 border border-[#E5E3D8]"
                  >
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-3 py-1 mb-1">
                      Servicios 3D & Experiencia
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1">
                      {/* 1. A Medida (Personalizados) */}
                      <button
                        id="nav-link-personalizados"
                        onClick={() => handleNavClick('personalizados')}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-[#FF6B2B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-neutral-900 group-hover:text-[#FF6B2B]">A Medida</div>
                          <div className="text-[10px] text-neutral-400 font-normal">Modelado, cotizador y pedidos personalizados</div>
                        </div>
                      </button>

                      {/* 2. Opiniones */}
                      <button
                        id="nav-link-testimonios"
                        onClick={() => handleNavClick('testimonios')}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-[#FF6B2B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-neutral-900 group-hover:text-[#FF6B2B]">Opiniones</div>
                          <div className="text-[10px] text-neutral-400 font-normal">Reseñas y calificaciones de clientes</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MÁS INFO DROPDOWN (Contacto, Quienes Somos, Como Comprar, FAQ, Mayoristas) */}
            <div 
              className="relative"
              onMouseEnter={() => setMoreInfoDropdownOpen(true)}
              onMouseLeave={() => setMoreInfoDropdownOpen(false)}
            >
              <button
                id="nav-link-mas-info"
                className="px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-white rounded-full transition-all flex items-center gap-1 bg-[#FF6B2B]/5 border border-[#FF6B2B]/20"
              >
                <Info className="w-3.5 h-3.5 text-[#FF6B2B]" />
                Más Info
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreInfoDropdownOpen ? 'rotate-180 text-[#FF6B2B]' : ''}`} />
              </button>

              <AnimatePresence>
                {moreInfoDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl z-50 border border-[#E5E3D8]"
                  >
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-3 py-1 mb-1">
                      Información Institucional & Ayuda
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1">
                      {/* 1. Contacto */}
                      <button
                        onClick={() => handleNavClick('contacto')}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-[#FF6B2B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <PhoneCall className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-800 group-hover:text-[#FF6B2B]">Contacto</div>
                          <div className="text-[10px] text-neutral-400 font-normal">WhatsApp, email y ubicación</div>
                        </div>
                      </button>

                      {/* 2. ¿Quiénes somos? */}
                      <button
                        onClick={() => handleNavClick('nosotros')}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF6B2B] flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-800 group-hover:text-[#FF6B2B]">¿Quiénes somos?</div>
                          <div className="text-[10px] text-neutral-400 font-normal">Nuestra historia y taller 3D</div>
                        </div>
                      </button>

                      {/* 3. ¿Cómo comprar? */}
                      <button
                        onClick={() => handleNavClick('como-comprar')}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF6B2B] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-800 group-hover:text-[#FF6B2B]">¿Cómo comprar?</div>
                          <div className="text-[10px] text-neutral-400 font-normal">Guía paso a paso y medios de pago</div>
                        </div>
                      </button>

                      {/* 4. Preguntas frecuentes */}
                      <button
                        onClick={() => handleNavClick('faq')}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-[#FF6B2B] hover:bg-[#FDFCF0] rounded-xl transition-all text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-800 group-hover:text-[#FF6B2B]">Preguntas frecuentes</div>
                          <div className="text-[10px] text-neutral-400 font-normal">Materiales, envíos y cuidados</div>
                        </div>
                      </button>

                      {/* 5. Info compras mayoristas */}
                      <button
                        onClick={() => handleNavClick('mayoristas')}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-xl transition-all text-left group border-t border-[#EAE7DC]/80 mt-1 pt-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-neutral-800 group-hover:text-emerald-700">Info Mayoristas</span>
                            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Hasta 40% OFF</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-normal truncate">Reventa, comercios y lotes</div>
                        </div>
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Buscador */}
            <button
              id="header-search-button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Buscar productos"
              className="w-10 h-10 rounded-full bg-white/80 border border-[#E5E3D8] flex items-center justify-center text-neutral-700 hover:text-[#FF6B2B] hover:border-[#FF6B2B]/40 hover:bg-white transition-all relative shadow-xs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Favoritos */}
            <button
              id="header-favorites-button"
              onClick={() => {
                setSelectedCategory('favoritos');
                handleNavClick('productos');
              }}
              aria-label="Ver favoritos"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/80 border border-[#E5E3D8] items-center justify-center text-neutral-700 hover:text-rose-600 hover:border-rose-300 hover:bg-white transition-all relative shadow-xs"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-[#FDFCF0]">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Carrito de Compra Action Icon */}
            <button
              id="header-cart-button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito de compra"
              className="relative w-10 h-10 rounded-full bg-white/80 border border-[#E5E3D8] hover:border-[#FF6B2B] flex items-center justify-center text-neutral-700 hover:text-[#FF6B2B] hover:bg-white transition-all shadow-xs cursor-pointer group"
            >
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#FF6B2B] text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-[#FDFCF0] shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white/80 border border-[#E5E3D8] flex items-center justify-center text-neutral-700 hover:bg-white transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#EFE9E0] bg-[#FAF8F5]/95 backdrop-blur-2xl px-4 py-6 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleNavClick('hero')}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800"
              >
                Inicio
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* SECCIÓN PRODUCTOS EN MOBILE */}
              <div className="border border-neutral-200/80 rounded-2xl bg-white/70 overflow-hidden">
                <button
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 hover:bg-orange-50/50"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF6B2B]" />
                    Productos
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${mobileProductsOpen ? 'rotate-180 text-[#FF6B2B]' : ''}`} />
                </button>

                {mobileProductsOpen && (
                  <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setSelectedCategory('ofertas');
                        handleNavClick('productos');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FF6B2B]/10 hover:bg-[#FF6B2B]/20 text-left text-xs font-bold text-[#FF6B2B]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 fill-[#FF6B2B]" />
                        Ofertas Especiales
                      </span>
                      <span className="text-[9px] bg-[#FF6B2B] text-white px-1.5 py-0.5 rounded font-black">
                        10% OFF
                      </span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {categories.map(c => {
                        const count = products.filter(p => p.category === c.id).length;
                        return (
                          <button
                            key={c.id}
                            onClick={() => handleCategorySelect(c.id)}
                            className="p-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200/80 rounded-xl text-left truncate hover:border-orange-400 flex items-center justify-between"
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-[10px] text-neutral-400 font-bold ml-1">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN SERVICIO EN MOBILE */}
              <div className="pt-2 pb-1 mt-1 border-t border-neutral-200/60">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 px-3 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Servicio
                </div>
                
                <div className="space-y-1 bg-white/70 rounded-2xl p-2 border border-neutral-200/80">
                  <button
                    onClick={() => handleNavClick('personalizados')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      A Medida (Personalizados)
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('testimonios')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      Opiniones de Clientes
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* SECCIÓN MÁS INFO EN MOBILE */}
              <div className="pt-3 pb-1 mt-2 border-t border-neutral-200/80">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#FF6B2B] px-3 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Más Info & Ayuda
                </div>
                
                <div className="space-y-1 bg-white/70 rounded-2xl p-2 border border-neutral-200/80">
                  <button
                    onClick={() => handleNavClick('contacto')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-neutral-500" />
                      Contacto
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('nosotros')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#FF6B2B]" />
                      ¿Quiénes somos?
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('como-comprar')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-500" />
                      ¿Cómo comprar?
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('faq')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-left font-semibold text-neutral-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      Preguntas frecuentes
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('mayoristas')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      Info compras mayoristas
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                      40% OFF
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
