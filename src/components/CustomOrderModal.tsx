import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Sparkles, 
  MessageCircle, 
  Upload, 
  Layers, 
  CheckCircle2, 
  Send,
  Cpu
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveCustomQuoteToFirestore } from '../services/db';

export const CustomOrderModal: React.FC = () => {
  const { isCustomModalOpen, setIsCustomModalOpen, addToast } = useCart();

  const [projectName, setProjectName] = useState('');
  const [material, setMaterial] = useState('PLA+');
  const [color, setColor] = useState('Negro Mate');
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isCustomModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setHasFile(true);
      addToast(`Archivo "${e.target.files[0].name}" preparado`, 'success');
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !clientName) {
      addToast('Por favor completá tu nombre y la idea del proyecto', 'warning');
      return;
    }

    await saveCustomQuoteToFirestore({
      clientName: clientName.trim(),
      projectName: projectName.trim(),
      material,
      color,
      quantity,
      dimensions: dimensions.trim() || undefined,
      notes: notes.trim() || undefined,
      fileName: hasFile ? fileName : undefined
    });

    const message = encodeURIComponent(
      `¡Hola Thunder 3D Impresiones! 🚀\n` +
      `Mi nombre es *${clientName}* y quisiera cotizar una pieza 3D personalizada:\n\n` +
      `📌 *Proyecto/Idea:* ${projectName}\n` +
      `🧪 *Material:* ${material}\n` +
      `🎨 *Color:* ${color}\n` +
      `🔢 *Cantidad:* ${quantity} unidad(es)\n` +
      `${dimensions ? `📏 *Medidas aprox:* ${dimensions}\n` : ''}` +
      `${notes ? `📝 *Detalles:* ${notes}\n` : ''}` +
      `${hasFile ? `📁 *Archivo adjunto preparado:* ${fileName}\n` : '📁 *Archivo:* Necesito asesoramiento de modelado 3D\n'}` +
      `\n¿Podrían indicarme costo y demora estimada? ¡Gracias!`
    );

    window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
    addToast('¡Solicitud guardada en sistema!', 'success');
    setIsCustomModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCustomModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCustomModalOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCustomModalOpen(false)}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
      />

      {/* Floating mobile close button */}
      <button
        type="button"
        onClick={() => setIsCustomModalOpen(false)}
        aria-label="Cerrar ventana"
        className="sm:hidden fixed top-3 right-3 z-[60] w-10 h-10 rounded-full bg-[#111111] text-white border-2 border-white/30 flex items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5]/98 backdrop-blur-2xl border border-white/80 rounded-2xl sm:rounded-3xl shadow-2xl z-10 my-1 sm:my-8 flex flex-col max-h-[94dvh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Sticky Mobile Header */}
        <div className="sm:hidden sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 border-b border-neutral-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
            <Sparkles className="w-4 h-4" />
            <span>Cotización a Medida</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Desktop Close button */}
        <button
          type="button"
          onClick={() => setIsCustomModalOpen(false)}
          className="hidden sm:flex absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 items-center justify-center text-neutral-400 hover:text-neutral-900 shadow-sm cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Servicio de Fabricación a Medida
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-neutral-900 mb-2">
            Presupuestá tu Impresión 3D
          </h2>

          <p className="text-xs text-neutral-600 mb-5 font-normal">
            Contanos tu idea o envianos tus archivos 3D (.STL, .OBJ, .STEP) para recibir asesoramiento técnico y cotización directa por WhatsApp.
          </p>

        <form onSubmit={handleSendWhatsApp} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Tu Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Sofía Benítez"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Tipo de Pieza / Nombre del proyecto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Soporte especial para volante logitech"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Material Preferido
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              >
                <option value="PLA+ (Estándar / Decorativo / Ecológico)">PLA+ (Ecológico y rígido)</option>
                <option value="PETG (Resistente a calor / impacto)">PETG (Mecánico e impermeable)</option>
                <option value="Resina 4K (Máximo detalle figuras)">Resina 4K (Ultra detalle)</option>
                <option value="TPU (Flexible / Goma)">TPU (Gomoso y elástico)</option>
                <option value="No estoy seguro (Asesorame)">No sé, asesorame</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Color
              </label>
              <input
                type="text"
                placeholder="Ej: Naranja, Negro mate, Blanco..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Medidas aprox. (Alto x Ancho x Prof. en cm)
              </label>
              <input
                type="text"
                placeholder="Ej: 15 x 10 x 8 cm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Archivo 3D o Boceto (.STL, .OBJ, .JPG)
              </label>
              <label className="border-2 border-dashed border-neutral-200 hover:border-orange-400 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer bg-white transition-all text-xs text-neutral-600">
                <Upload className="w-4 h-4 text-orange-500" />
                <span className="truncate">{hasFile ? fileName : 'Seleccionar archivo'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">
              Detalles adicionales / Uso de la pieza
            </label>
            <textarea
              rows={3}
              placeholder="Explicá para qué se utilizará la pieza, si requiere roscas, encastres o resistencia específica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-800 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Enviar solicitud por WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(false)}
              className="w-full py-2.5 rounded-2xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar y cerrar ventana
            </button>
          </div>

        </form>

        </div>

      </motion.div>
    </div>
  );
};
