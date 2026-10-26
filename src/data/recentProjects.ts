export interface RecentProject {
  id: string;
  title: string;
  category: 'engineering' | 'architecture' | 'cosplay' | 'deco' | 'corporate';
  categoryLabel: string;
  client: string;
  clientLocation: string;
  description: string;
  detailedSpecs: {
    material: string;
    layerHeight: string;
    infill: string;
    printDuration: string;
    weight: string;
    technology: string;
  };
  mainImage: string;
  galleryImages?: string[];
  highlightBadge: string;
  testimonialSnippet?: string;
  interiorDetails?: {
    title: string;
    items: string[];
  };
  gridSpan: {
    colSpan: string; // e.g. 'lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4'
    rowSpan?: string;
  };
  featured?: boolean;
}

export const RECENT_PROJECTS: RecentProject[] = [
  {
    id: 'proj-1',
    title: 'Maqueta Arquitectónica Modular Edificio Residencial',
    category: 'architecture',
    categoryLabel: 'Arquitectura & Urbanismo',
    client: 'Estudio de Arquitectura',
    clientLocation: 'Capital Federal',
    description: 'Impresión de maqueta arquitectónica por niveles modulares desmontables sobre planos técnicos, con terminación en blanco mate, carpinterías y balcones detallados.',
    detailedSpecs: {
      material: 'PLA+ Blanco Mate Arquitectura',
      layerHeight: '0.12 mm (Alta precisión)',
      infill: '15% Gyroid optimizado',
      printDuration: '48 horas (Niveles ensamblables)',
      weight: '920 g',
      technology: 'FDM Precisión Arquitectónica'
    },
    mainImage: '/assets/aistudio/arquitectura_3d_bca0eb26.jpg',
    galleryImages: [
      '/assets/aistudio/arquitectura_3d_bca0eb26.jpg',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlightBadge: 'Escala 1:50 • Modular por Pisos',
    testimonialSnippet: 'La fidelidad dimensional y el encastre de las piezas facilitó la presentación ante los inversores.',
    interiorDetails: {
      title: 'Detalles del Modelo: Estructura Modular por Pisos',
      items: [
        'Niveles seccionales desmontables para inspeccionar la distribución de ambientes y alturas de entrepiso.',
        'Ventanas con marcos perfilados a escala y balcones voladizos impresos con tolerancias de ajuste milimétrico.',
        'Base de encastre hexagonal perfecta para presentaciones ante clientes y comisiones de obra.'
      ]
    },
    gridSpan: {
      colSpan: 'lg:col-span-8',
      rowSpan: 'lg:row-span-2'
    },
    featured: true
  },
  {
    id: 'proj-2',
    title: 'Carcasas Ergonómicas para Herramientas Inalámbricas',
    category: 'engineering',
    categoryLabel: 'Ingeniería & Prototipos',
    client: 'Industrias ProTool & Tech',
    clientLocation: 'Capital Federal',
    description: 'Prototipado rápido y validación ergonómica de carcasas para atornilladores inalámbricos en 4 variantes de color, con zonas de agarre bimaterial y encastres para motor.',
    detailedSpecs: {
      material: 'ABS Industrial + TPU 95A Antideslizante',
      layerHeight: '0.16 mm (Tolerancia ±0.1 mm)',
      infill: '40% Gyroid reforzado',
      printDuration: '22 horas (Set de 4 prototipos)',
      weight: '260 g c/u',
      technology: 'FDM Doble Extrusión Bimaterial'
    },
    mainImage: '/images/prototipo_herramientas_3d.jpg',
    galleryImages: [
      '/images/prototipo_herramientas_3d.jpg'
    ],
    highlightBadge: 'Bimaterial ABS/TPU • Tolerancia ±0.1mm',
    testimonialSnippet: 'Pudimos validar la ergonomía de agarre y el ensamble del motor antes de mandar a fabricar las matrices de inyección.',
    gridSpan: {
      colSpan: 'lg:col-span-4'
    }
  },
  {
    id: 'proj-3',
    title: 'Casco Cyberpunk con Visera Translúcida y Montaje LED',
    category: 'cosplay',
    categoryLabel: 'Gaming & Cosplay',
    client: 'Martín V. (Cosplayer & Creador)',
    clientLocation: 'Palermo, CABA',
    description: 'Réplica tamaño real con ranuras internas para cableado LED, almohadillas ergonómicas magnéticas y post-procesado con imprimación bicomponente.',
    detailedSpecs: {
      material: 'PLA+ Tough Negro & Resina UV Translúcida',
      layerHeight: '0.16 mm',
      infill: '20% Gradiente',
      printDuration: '42 horas',
      weight: '890 g',
      technology: 'FDM Multi-Pieza + Resina SLA'
    },
    mainImage: '/images/casco_cyberpunk_cosplay_3d.jpg',
    galleryImages: [
      '/images/casco_cyberpunk_cosplay_3d.jpg'
    ],
    highlightBadge: 'Tamaño Real 1:1 • LEDs Integrados',
    testimonialSnippet: 'El calce es perfecto y el acabado no necesitó casi masilla.',
    gridSpan: {
      colSpan: 'lg:col-span-4'
    }
  },
  {
    id: 'proj-4',
    title: 'Trofeos Personalizados Multicolores para Torneo de Pádel',
    category: 'corporate',
    categoryLabel: 'Corporativo & Merchandising',
    client: 'Circuito de Pádel Metropolitano',
    clientLocation: 'Palermo, CABA',
    description: 'Fabricación de trofeos de premiación en relieve 3D con doble paleta, pelota y tipografía volumétrica multicapa montada sobre peana negra grabada.',
    detailedSpecs: {
      material: 'PLA+ Multicolores & Base Negra Mate',
      layerHeight: '0.16 mm (Alta nitidez en tipografía)',
      infill: '30% Grid reforzado',
      printDuration: '48 horas (Lote de premiación)',
      weight: '340 g c/u',
      technology: 'FDM Multicolor & Ensamble Dimensional'
    },
    mainImage: '/images/trofeo_padel_3d.jpg',
    galleryImages: [
      '/images/trofeo_padel_3d.jpg'
    ],
    highlightBadge: 'Ensamble Multicolor 3D • Premiación',
    testimonialSnippet: 'La calidad del relieve y la viveza de los colores superaron a los trofeos tradicionales de acrílico.',
    gridSpan: {
      colSpan: 'lg:col-span-4'
    }
  },
  {
    id: 'proj-5',
    title: 'Colección de Veladores y Lámparas de Mesa Geométricas 3D',
    category: 'deco',
    categoryLabel: 'Arte & Decoración',
    client: 'Estudio de Diseño Lumen',
    clientLocation: 'Córdoba Capital',
    description: 'Diseño contemporáneo de veladores de mesa impresos en 3D con torsión geométrica y difusores en espiral. Fabricados en PLA blanco translúcido con base circular mate e iluminación LED cálida envolvente.',
    detailedSpecs: {
      material: 'PLA Translúcido Premium & Base Negra Mate',
      layerHeight: '0.20 mm en modo Vaso Espiral',
      infill: '100% Continuo en difusor',
      printDuration: '16 horas',
      weight: '380 g',
      technology: 'FDM Vaso Espiral Continuo'
    },
    mainImage: '/images/velador_arte_decoracion_3d.jpg',
    galleryImages: [
      '/images/velador_arte_decoracion_3d.jpg'
    ],
    highlightBadge: 'Diseño Torsión & Espiral • Luz Cálida',
    testimonialSnippet: 'La difusión de la luz cálida y el acabado de la torsión geométrica impresionaron a todos nuestros clientes.',
    gridSpan: {
      colSpan: 'lg:col-span-4'
    }
  }
];

export const GALLERY_STATS = [
  { label: 'Proyectos Entregados', value: '200+' },
  { label: 'Tolerancia Dimensional', value: '±0.1 mm' },
  { label: 'Horas de Impresión', value: '600 h+' },
  { label: 'Materiales Especiales', value: '8 Variedades' }
];
