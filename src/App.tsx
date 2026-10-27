import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { Categories } from './components/Categories';
import { ProductGrid } from './components/ProductGrid';
import { PromoBanner } from './components/PromoBanner';
import { HowItWorks } from './components/HowItWorks';
import { CustomProduct } from './components/CustomProduct';
import { RecentProjects } from './components/RecentProjects';
import { Testimonials } from './components/Testimonials';
import { AboutSection } from './components/AboutSection';
import { WholesaleSection } from './components/WholesaleSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { AdminStockModal } from './components/AdminStockModal';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppIcon } from './components/WhatsAppIcon';

const MainLayout: React.FC = () => {
  const { currentView, whatsappNumber, isCartDisabled } = useCart();

  const handleOpenWhatsAppSupport = () => {
    const phone = whatsappNumber || '5491123456789';
    window.open(`https://wa.me/${phone}?text=Hola%20Thunder%203D!%20Tengo%20una%20consulta`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF0] text-[#1A1A1A] relative selection:bg-[#FF6B2B] selection:text-white font-sans">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'checkout' && !isCartDisabled ? (
          <Checkout />
        ) : (
          <>
            {/* 3. Hero */}
            <Hero />

            {/* 4. Beneficios */}
            <Benefits />

        {/* 5. Categorías */}
        <Categories />

        {/* 6. Productos Destacados & Catálogo */}
        <ProductGrid />

        {/* 7. Banner Promocional 10% OFF */}
        <PromoBanner />

        {/* 8. Cómo Funciona */}
        <HowItWorks />

        {/* 9. Producto Personalizado */}
        <CustomProduct />

        {/* 10. Proyectos Recientes a Medida (Bento Grid) */}
        <RecentProjects />

        {/* 11. Testimonios de Clientes (Bento Grid) */}
        <Testimonials />

        {/* 12. Nosotros / ¿Quiénes somos? */}
        <AboutSection />

        {/* 13. Info Compras Mayoristas */}
        <WholesaleSection />

        {/* 14. Preguntas Frecuentes */}
        <FAQSection />

        {/* 15. Contacto */}
        <ContactSection />
          </>
        )}
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button with official logo */}
      <button
        id="floating-whatsapp-btn"
        onClick={handleOpenWhatsAppSupport}
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white/70 animate-whatsapp-pulse cursor-pointer"
      >
        <WhatsAppIcon className="w-8 h-8 fill-white" />
        <span className="absolute left-16 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          ¡Chateá con el taller 3D!
        </span>
      </button>

      {/* Modals & Feedback */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <CustomOrderModal />
      <AdminStockModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
