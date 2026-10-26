import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Logo Efectivo (Círculo con símbolo $)
export const EfectivoIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle */}
    <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3" />
    {/* Dollar Sign */}
    <path
      d="M24 8v32M29.5 16.5c0-3-2.5-5-5.5-5-3.5 0-6 2-6 5s2.5 4.5 6 5.5 6 2.5 6 5.5-2.5 5.5-6 5.5c-3.5 0-6-2.5-6-5.5"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Logo Depósito Bancario / Transferencia (Fachada clásica con columnas)
export const DepositoBancarioIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Triangular Pediment / Roof */}
    <path d="M24 6L6 16h36L24 6z" />
    {/* Architrave bar below roof */}
    <rect x="8" y="17.5" width="32" height="3" rx="0.5" />
    {/* 3 Classical Columns */}
    <rect x="11.5" y="22.5" width="5" height="15" rx="1" />
    <rect x="21.5" y="22.5" width="5" height="15" rx="1" />
    <rect x="31.5" y="22.5" width="5" height="15" rx="1" />
    {/* Base Steps */}
    <rect x="8" y="39" width="32" height="2.5" rx="0.5" />
    <rect x="6" y="42" width="36" height="3" rx="0.5" />
  </svg>
);

// 3. Logo Mercado Pago / Tarjeta de Crédito (Diseño tarjeta con banda magnética y números)
export const MercadoPagoCardIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Card body */}
    <rect x="4" y="9" width="40" height="30" rx="4" />
    {/* Magnetic Stripe (cutout in white/background) */}
    <rect x="4" y="15" width="40" height="6" fill="#FDFCF0" fillOpacity="0.3" />
    {/* Embossed digits row 1 */}
    <g fill="#FDFCF0" fillOpacity="0.85">
      <rect x="8" y="28" width="6" height="2.2" rx="0.5" />
      <rect x="16" y="28" width="6" height="2.2" rx="0.5" />
      <rect x="24" y="28" width="6" height="2.2" rx="0.5" />
      <rect x="32" y="28" width="6" height="2.2" rx="0.5" />
      {/* Subtext / Cardholder placeholder */}
      <rect x="8" y="33" width="14" height="1.8" rx="0.4" />
    </g>
  </svg>
);

// 4. Logo A Convenir (Pulgar hacia arriba / Thumbs up)
export const AConvenirIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hand body & Thumb outline */}
    <path d="M16 23v17H8a2 2 0 01-2-2V25a2 2 0 012-2h8z" fill="currentColor" fillOpacity="0.15" />
    <path d="M16 23l6-15a3 3 0 015.5 2.2L25 21h13a4 4 0 013.9 4.8l-2.4 12A4 4 0 0135.6 41H16" />
    {/* Finger ridges */}
    <path d="M38 27H26" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M36 32H26" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M34 37H26" strokeWidth="1.5" strokeOpacity="0.4" />
  </svg>
);

// Componente Banner Unificado de Medios de Pago
export const PaymentMethodsBanner: React.FC<{ variant?: 'light' | 'dark' | 'compact' }> = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  const items = [
    {
      id: 'efectivo',
      title: 'Efectivo',
      subtitle: 'En taller o contra entrega',
      Icon: EfectivoIcon,
      accent: '#0D7E66',
      badge: 'SIN RECARGO'
    },
    {
      id: 'banco',
      title: 'Depósito / Transferencia',
      subtitle: 'CBU, CVU o Alias bancario',
      Icon: DepositoBancarioIcon,
      accent: '#0D7E66',
      badge: '10% EXTRA OFF'
    },
    {
      id: 'mercadopago',
      title: 'Mercado Pago',
      subtitle: 'Dinero en cuenta, tarjetas, QR',
      Icon: MercadoPagoCardIcon,
      accent: '#0D7E66',
      badge: 'ACREDITACIÓN INMEDIATA'
    },
    {
      id: 'convenir',
      title: 'A Convenir',
      subtitle: 'Personalizado por WhatsApp',
      Icon: AConvenirIcon,
      accent: '#0D7E66',
      badge: 'ATENCIÓN DIRECTA'
    }
  ];

  return (
    <div className={`rounded-3xl p-4 sm:p-6 transition-all ${
      isDark 
        ? 'bg-neutral-900/90 border border-white/10' 
        : 'bg-white border border-[#E5E3D8] shadow-xs'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-neutral-200/40">
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider font-['Outfit'] flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#0D7E66] animate-pulse"></span>
            Medios de Pago Aceptados
          </h3>
          <p className={`text-[11px] font-normal ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Múltiples opciones seguras para abonar tus pedidos e impresiones 3D
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0D7E66]/15 text-[#0D7E66] border border-[#0D7E66]/30 self-start sm:self-auto">
          Pagos 100% Protegidos
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center group hover:scale-102 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:border-[#0D7E66]/60 hover:bg-white/10'
                : 'bg-[#FDFCF0] border-[#E5E3D8] hover:border-[#0D7E66]/50 hover:bg-white hover:shadow-md hover:shadow-[#0D7E66]/5'
            }`}
          >
            {/* Payment Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#0D7E66]/10 text-[#0D7E66] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <item.Icon className="w-7 h-7" />
            </div>

            {/* Title */}
            <div className={`text-xs font-black font-['Outfit'] mb-0.5 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {item.title}
            </div>

            {/* Subtitle */}
            <div className={`text-[10px] line-clamp-1 mb-2 font-medium ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {item.subtitle}
            </div>

            {/* Badge */}
            <span className="mt-auto text-[8.5px] font-black tracking-wider px-2 py-0.5 rounded-md bg-[#0D7E66]/15 text-[#0D7E66] uppercase">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
