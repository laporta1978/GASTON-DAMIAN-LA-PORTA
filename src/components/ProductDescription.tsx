import React from 'react';
import { 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldCheck,
  Truck
} from 'lucide-react';

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

interface ParsedSection {
  type: 'intro' | 'delivery' | 'custom' | 'warning' | 'bullet' | 'note' | 'standard';
  title?: string;
  content: string;
}

/**
 * Parses and neatly segments product descriptions so that each line ("cada renglón")
 * is clearly structured, readable, and properly spaced.
 */
export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, className = '' }) => {
  if (!description) return null;

  // 1. Normalize line breaks and split into logical lines
  // If text doesn't contain newline characters, split intelligently by known section anchors
  const normalizeAndSegment = (rawText: string): string[] => {
    let text = rawText.trim();

    // If text doesn't already have explicit newlines, insert newlines before common headings
    const knownAnchors = [
      'PLAZO DE ENTREGA:',
      'PLAZOS DE ENTREGA:',
      'TIEMPO DE ENTREGA:',
      'TIEMPO DE FABRICACION:',
      'TIEMPO DE FABRICACIÓN:',
      'JARRAS PERSONALIZADAS:',
      'JARRA PERSONALIZADA:',
      'PERSONALIZADOS:',
      'PEDIDOS PERSONALIZADOS:',
      'RECOMENDACIONES EXPLICITAS:',
      'RECOMENDACIONES EXPLÍCITAS:',
      'RECOMENDACIONES:',
      'RECOMENDACION:',
      'CUIDADOS:',
      'PRECAUCIONES:',
      'ADVERTENCIA:',
      'IMPORTANTE:',
      'ATENCION:',
      'ATENCIÓN:',
      'CARACTERISTICAS:',
      'CARACTERÍSTICAS:',
      'ENVIOS:',
      'ENVÍOS:',
      'MATERIALES:',
      'INCLUYE:'
    ];

    // Check if newlines are missing or rare
    const hasFewNewlines = (text.match(/\n/g) || []).length < 2;

    if (hasFewNewlines) {
      // Split before markdown bold anchors like **PARA PERSONALIZADOS...**
      text = text.replace(/([^\n])\s*(\*\*[^*]+(?::|\*\*))/g, '$1\n\n$2');

      // Split before known uppercase anchors
      for (const anchor of knownAnchors) {
        const regex = new RegExp(`([^\\n])\\s*(${anchor})`, 'gi');
        text = text.replace(regex, '$1\n\n$2');
      }

      // Also split after emojis that end a title/intro like 💙 💛 BOCA JUNIORS
      text = text.replace(/((?:💙|💛|🔥|⭐|✨|⚡)\s*[A-Z0-9\s]+?)\s+(?=(?:PLAZO|TIEMPO|DEMORA|RECOMENDACION|CUIDADOS|IMPORTANTE|\*\*))/gi, '$1\n\n');
    }

    // Split by newlines and clean up empty lines
    return text
      .split(/\r?\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const rawLines = normalizeAndSegment(description);

  // 2. Classify each line for appropriate formatting
  const sections: ParsedSection[] = rawLines.map((line, idx) => {
    // Markdown bold wrap: **...**
    const isFullBold = line.startsWith('**') && line.endsWith('**') && line.length > 4;
    const cleanFullBold = isFullBold ? line.slice(2, -2).trim() : line;

    // Check for Warnings / Recommendations / Care notes
    const warningMatch = line.match(/^(?:RECOMENDACIONES?(?:\s+EXPL[IÍ]CITAS?)?|CUIDADOS?|PRECAUCI[OÓ]NES?|ADVERTENCIA|ATENCI[OÓ]N):\s*(.+)/i);
    if (warningMatch) {
      return {
        type: 'warning',
        title: 'Recomendaciones de Cuidado',
        content: warningMatch[1].trim()
      };
    }

    if (/^NO EXPONER|^NO LAVAR EN LAVAVAJILLAS|^NO RELLENAR/i.test(line)) {
      return {
        type: 'warning',
        title: 'Recomendaciones de Uso',
        content: line
      };
    }

    // Check for Delivery / Plazos
    const deliveryMatch = line.match(/^(?:PLAZOS?\s+DE\s+ENTREGA|TIEMPO\s+DE\s+ENTREGA|TIEMPO\s+DE\s+FABRICACI[OÓ]N):\s*(.+)/i);
    if (deliveryMatch) {
      return {
        type: 'delivery',
        title: 'Plazo de Entrega',
        content: deliveryMatch[1].trim()
      };
    }

    // Check for Custom / Personalizados
    const customMatch = line.match(/^(?:JARRAS?\s+PERSONALIZADAS?|PEDIDOS?\s+PERSONALIZADOS?|PERSONALIZADOS?):\s*(.+)/i);
    if (customMatch) {
      return {
        type: 'custom',
        title: 'Jarras / Pedidos Personalizados',
        content: customMatch[1].trim()
      };
    }

    // Check for important note (e.g. **PARA PERSONALIZADOS EN MAS DE 5 UNIDADES...**)
    if (isFullBold || /^IMPORTANTE:/i.test(line) || /CONSULTAR PLAZO DE ENTREGA/i.test(line)) {
      const noteContent = line.replace(/^IMPORTANTE:\s*/i, '').replace(/^\*\*|\*\*$/g, '').trim();
      return {
        type: 'note',
        title: 'Aviso Importante',
        content: noteContent
      };
    }

    // Check for bullet items
    if (/^[•\-\*]\s+/.test(line)) {
      return {
        type: 'bullet',
        content: line.replace(/^[•\-\*]\s+/, '').trim()
      };
    }

    // First line is often the main intro / title presentation
    if (idx === 0 && line.length < 180) {
      return {
        type: 'intro',
        content: line
      };
    }

    return {
      type: 'standard',
      content: line
    };
  });

  // Helper to render text with inline **bold** support
  const renderInlineMarkdown = (text: string) => {
    // Split by **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-[#111111]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`space-y-2.5 text-xs sm:text-sm antialiased text-pretty select-text ${className}`}>
      {sections.map((sec, index) => {
        switch (sec.type) {
          case 'intro':
            return (
              <div 
                key={index} 
                className="font-semibold text-neutral-800 leading-relaxed text-xs sm:text-sm pb-1 border-b border-[#EAE7DC]/70"
              >
                {renderInlineMarkdown(sec.content)}
              </div>
            );

          case 'delivery':
            return (
              <div 
                key={index} 
                className="flex items-start gap-2.5 py-1.5 px-3 rounded-xl bg-orange-50/60 border border-orange-100/80 text-neutral-800"
              >
                <Truck className="w-4 h-4 text-[#FF6B2B] shrink-0 mt-0.5" />
                <div className="leading-snug text-xs sm:text-[13px]">
                  <strong className="font-extrabold text-[#111111] uppercase tracking-wider text-[11px] block sm:inline sm:mr-1.5">
                    {sec.title}:
                  </strong>
                  <span className="font-medium text-neutral-700">
                    {renderInlineMarkdown(sec.content)}
                  </span>
                </div>
              </div>
            );

          case 'custom':
            return (
              <div 
                key={index} 
                className="flex items-start gap-2.5 py-1.5 px-3 rounded-xl bg-amber-50/60 border border-amber-100/80 text-neutral-800"
              >
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="leading-snug text-xs sm:text-[13px]">
                  <strong className="font-extrabold text-[#111111] uppercase tracking-wider text-[11px] block sm:inline sm:mr-1.5">
                    {sec.title}:
                  </strong>
                  <span className="font-medium text-neutral-700">
                    {renderInlineMarkdown(sec.content)}
                  </span>
                </div>
              </div>
            );

          case 'note':
            return (
              <div 
                key={index} 
                className="flex items-start gap-2.5 py-2 px-3 rounded-xl bg-neutral-100/80 border border-neutral-200/90 text-neutral-800"
              >
                <Info className="w-4 h-4 text-[#FF6B2B] shrink-0 mt-0.5" />
                <div className="leading-snug text-xs sm:text-[13px]">
                  <strong className="font-extrabold text-[#111111] uppercase tracking-wider text-[11px] block mb-0.5">
                    {sec.title}
                  </strong>
                  <span className="font-semibold text-neutral-800">
                    {renderInlineMarkdown(sec.content)}
                  </span>
                </div>
              </div>
            );

          case 'warning':
            return (
              <div 
                key={index} 
                className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 my-1"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                    {sec.title}
                  </span>
                </div>
                <p className="text-xs sm:text-[12.5px] text-amber-950 font-medium leading-relaxed pl-6">
                  {renderInlineMarkdown(sec.content)}
                </p>
              </div>
            );

          case 'bullet':
            return (
              <div key={index} className="flex items-start gap-2 pl-1 text-neutral-700 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B2B] shrink-0 mt-1" />
                <span className="font-medium">{renderInlineMarkdown(sec.content)}</span>
              </div>
            );

          case 'standard':
          default:
            return (
              <p 
                key={index} 
                className="text-neutral-700 font-medium leading-relaxed text-xs sm:text-sm"
              >
                {renderInlineMarkdown(sec.content)}
              </p>
            );
        }
      })}
    </div>
  );
};
