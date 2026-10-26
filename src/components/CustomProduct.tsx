import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MessageCircle, 
  Upload, 
  Cpu, 
  Layers, 
  Palette, 
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveCustomQuoteToFirestore } from '../services/db';

export const CustomProduct: React.FC = () => {
  const { setIsCustomModalOpen, addToast } = useCart();

  const [projectType, setProjectType] = useState('Prototipo / Pieza a medida');
  const [material, setMaterial] = useState('PLA+');
  const [selectedColor, setSelectedColor] = useState('Negro Mate');
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');

  const materials = [
    { name: 'PLA+', desc: 'Alta rigidez, ecológico, ideal para decoración y soportes' },
    { name: 'PETG', desc: 'Resistente a impactos, intemperie y calor moderado' },
    { name: 'TPU Flexible', desc: 'Piezas gomosas con amortiguación y elasticidad' }
  ];

  const colors = [
    { name: 'Negro Mate', hex: '#18181B' },
    { name: 'Naranja Thunder', hex: '#EA580C' },
    { name: 'Blanco Nieve', hex: '#FFFFFF' },
    { name: 'Gris Plata', hex: '#9CA3AF' },
    { name: 'Azul Eléctrico', hex: '#2563EB' },
    { name: 'Verde Militar', hex: '#15803D' }
  ];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setHasFile(true);
      addToast(`Archivo "${e.target.files[0].name}" cargado para cotización`, 'success');
    }
  };

  const handleWhatsAppConsult = async () => {
    saveCustomQuoteToFirestore({
      clientName: 'Cliente Web Simulación',
      projectName: projectType,
      material,
      color: selectedColor,
      quantity: 1,
      fileName: hasFile ? fileName : undefined
    });

    const message = encodeURIComponent(
      `¡Hola Thunder 3D Impresiones! 👋\n\nTengo una idea y me gustaría cotizar una impresión 3D:\n\n` +
      `📌 Tipo de proyecto: ${projectType}\n` +
      `🧪 Material recomendado: ${material}\n` +
      `🎨 Color preferido: ${selectedColor}\n` +
      `${hasFile ? `📁 Archivo 3D/Boceto: ${fileName}\n` : '📁 Archivo: Aún no tengo archivo, necesito asesoramiento de diseño\n'}` +
      `\n¿Podrían darme más detalles sobre costos y tiempos de entrega en CABA? ¡Gracias!`
    );
    window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
  };

  return (
    <section id="personalizados" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[36px] sm:rounded-[44px] bg-white border border-[#E5E3D8] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
          
          {/* Bento ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B2B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Information & Text */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFCF0] border border-[#E5E3D8] text-[11px] font-black text-[#FF6B2B] uppercase tracking-wider mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Servicio a Medida
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-[#111111] leading-tight mb-4">
                ¿Tenés una idea?
              </h2>

              <p className="text-lg sm:text-xl font-black text-[#FF6B2B] font-['Outfit'] mb-4">
                Podemos convertir tu diseño en una impresión 3D.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                Desde repuestos descontinuados y maquetas de arquitectura, hasta regalos empresariales con logo, litofanías y coleccionables únicos. Te asesoramos sin costo en el archivo y material.
              </p>

              {/* Feature Points */}
              <div className="space-y-3 mb-8 w-full">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                  <span>Aceptamos archivos STL, OBJ, STEP o simples fotos con medidas.</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                  <span>Modelado y optimización  incluido si no tenés el archivo 3D.</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B2B] shrink-0" />
                  <span>Muestras previas y cotización instantánea en menos de 4 horas.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full">
                <button
                  id="custom-btn-whatsapp"
                  onClick={handleWhatsAppConsult}
                  className="px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Consultar por WhatsApp
                </button>

                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[#F7F6EE] border border-[#E5E3D8] hover:border-[#FF6B2B] text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-[#FF6B2B]" />
                  Configurador completo
                </button>
              </div>

            </div>

            {/* Right Column: Interactive Quick Simulator Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#FDFCF0] rounded-3xl border border-[#E5E3D8] p-6 sm:p-8 shadow-xs">
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EAE7DC]">
                  <span className="text-xs font-black text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#FF6B2B]" />
                    Simulador  de Cotización
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                    Presupuesto Sin Cargo
                  </span>
                </div>

                {/* Step 1: Project Type */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    1. ¿Qué tipo de pieza necesitás?
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-white border border-[#E5E3D8] rounded-xl px-3 py-2 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#FF6B2B]"
                  >
                    <option value="Prototipo / Pieza a medida">Prototipo / Pieza funcional a medida</option>
                    <option value="Repuesto mecánico / Soporte específico">Repuesto de máquina / Soporte específico</option>
                    <option value="Figura / Escultura / Coleccionable">Figura / Escultura / Coleccionable</option>
                    <option value="Llaveros / Merchandising con logo">Llaveros / Merchandising con logo de empresa</option>
                    <option value="Lámpara Litofanía con foto">Lámpara Litofanía con foto personalizada</option>
                  </select>
                </div>

                {/* Step 2: Material */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    2. Filamento / Material:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {materials.map(m => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setMaterial(m.name)}
                        className={`p-2.5 rounded-2xl text-left border transition-all ${
                          material === m.name
                            ? 'border-[#FF6B2B] bg-white text-[#FF6B2B] font-bold shadow-xs'
                            : 'border-[#E5E3D8] bg-white hover:border-[#FF6B2B]/40 text-neutral-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{m.name}</div>
                        <div className="text-[10px] text-neutral-500 line-clamp-1">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Color */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    3. Color principal: <span className="text-[#FF6B2B] font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                          selectedColor === c.name ? 'ring-2 ring-[#FF6B2B] scale-110 border-white' : 'border-[#E5E3D8]'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Step 4: Simulated File Upload */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    4. Adjuntar archivo o boceto (Opcional):
                  </label>
                  <label className="border-2 border-dashed border-[#E5E3D8] hover:border-[#FF6B2B] rounded-2xl p-3 flex items-center justify-center gap-3 cursor-pointer bg-white hover:bg-[#FF6B2B]/5 transition-all text-xs text-neutral-600">
                    <Upload className="w-4 h-4 text-[#FF6B2B]" />
                    <span>{hasFile ? `Adjuntado: ${fileName}` : 'Subir archivo .STL / .OBJ / Foto (.jpg, .png)'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSimulatedFileUpload}
                    />
                  </label>
                </div>

                {/* Action summary trigger */}
                <button
                  onClick={handleWhatsAppConsult}
                  className="w-full py-3.5 rounded-2xl bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF6B2B] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Enviar configuración por WhatsApp
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
