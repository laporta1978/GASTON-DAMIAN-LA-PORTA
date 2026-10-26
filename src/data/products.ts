import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'jarras',
    name: 'Jarras',
    description: 'Chopps vikingos, jarras gamer temáticas con relieve e inserto para lata o térmico.',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    count: 8,
    iconName: 'Coffee'
  },
  {
    id: 'ceramica',
    name: 'Cerámica',
    description: 'Herramientas de modelado, sellos, texturadores y moldes para alfarería y arcilla.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    count: 10,
    iconName: 'Palette'
  },
  {
    id: 'cortantes',
    name: 'Cortantes',
    description: 'Cortantes para repostería, galletitas, fondant y arcilla polimérica con filo de alta definición.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    count: 14,
    iconName: 'Cookie'
  },
  {
    id: 'mate',
    name: 'Mate',
    description: 'Mates 3D térmicos con interior de polímero removible, virolas grabadas y diseños temáticos.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80',
    count: 9,
    iconName: 'Flame'
  },
  {
    id: 'llaveros',
    name: 'Llaveros 3D',
    description: 'Llaveros articulados, souvenirs para eventos, destapadores y piezas coleccionables con logo.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    count: 16,
    iconName: 'Key'
  },
  {
    id: 'botellas-cortadas',
    name: 'Botellas Cortadas',
    description: 'Vasos, macetas y lámparas artesanales a partir de botellas de vidrio recicladas, pulidas al fuego.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    count: 7,
    iconName: 'Wine'
  },
  {
    id: 'personalizados',
    name: 'Personalizados',
    description: 'Fabricación a medida: traé tu logo, cortante personalizado, jarras o mates corporativos.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    count: 6,
    iconName: 'Wrench'
  }
];

export const PRODUCTS: Product[] = [
  // --- JARRAS ---
  {
    id: 'jarra-chopp-vikingo-calavera-3d',
    name: 'Chopp Vikingo Nórdico 3D con Inserto Térmico (500ml)',
    slug: 'jarra-chopp-vikingo-calavera-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra chopp con relieve de runas nórdicas, mango ergonómico y espacio para vaso térmico interior.',
    longDescription: 'Impresionante jarra temática con textura de madera añejada y detalles en relieve vikingo. Diseñada con calce perfecto para inserto de acero inoxidable o lata de 473/500ml.',
    price: 13900,
    originalPrice: 16500,
    isOffer: true,
    discountPercent: 15,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 5.0,
    reviewsCount: 84,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '16 x 14 x 11 cm',
    printTime: '11 hs',
    colors: [
      { name: 'Madera & Bronce', hex: '#92400E' },
      { name: 'Negro & Plata', hex: '#18181B' },
      { name: 'Naranja Thunder', hex: '#EA580C' }
    ],
    tags: ['Jarras', 'Vikingo', 'Cerveza', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'jarra-chopp-gamer-personalizada',
    name: 'Jarra Chopp Gamer con Relieve y Logo Personalizado',
    slug: 'jarra-chopp-gamer-personalizada',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra temática inspirada en videojuegos y series con asa reforzada y base antideslizante.',
    longDescription: 'Ideal para tus sesiones de stream, torneos o regalo especial. Fabricada en filamento de alta resistencia mecánica. Posibilidad de personalizar el nombre o logo en el frente.',
    price: 12500,
    originalPrice: 14800,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 52,
    inStock: true,
    printMaterial: 'PETG',
    dimensions: '15 x 13 x 10 cm',
    printTime: '9 hs 30 min',
    colors: [
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Naranja Eléctrico', hex: '#EA580C' },
      { name: 'Rojo Fuego', hex: '#DC2626' }
    ],
    tags: ['Jarras', 'Gamer', 'Personalizado'],
    isFeatured: true
  },
  {
    id: 'chopp-barril-medieval-roble-3d',
    name: 'Chopp Barril Medieval Simil Roble con Zunchos',
    slug: 'chopp-barril-medieval-roble-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra tipo barril de cerveza artesanal con veta de madera realista y aros metálicos.',
    longDescription: 'Diseño robusto para eventos, asados y amantes de la cerveza artesanal. Permite insertar latón térmico de 500cc manteniendo la bebida fresca.',
    price: 11900,
    originalPrice: 13800,
    isOffer: true,
    discountPercent: 14,
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: 46,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '15 x 12 x 12 cm',
    printTime: '10 hs',
    colors: [
      { name: 'Roble Oscuro', hex: '#78350F' },
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Cobre Envejecido', hex: '#B45309' }
    ],
    tags: ['Jarras', 'Medieval', 'Cerveza', 'Artesanal']
  },
  {
    id: 'jarra-chopp-calavera-goth-3d',
    name: 'Jarra Calavera Chopp Gothic 3D con Asa de Huesos',
    slug: 'jarra-chopp-calavera-goth-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra con relieve de calavera gótica y acabado metalizado oscuro para latas o tragos.',
    longDescription: 'Diseño hiperdetallado de calavera en alto relieve con empuñadura anatómica. Incluye cavidad aislante para conservar la temperatura.',
    price: 13500,
    originalPrice: 15900,
    isOffer: true,
    discountPercent: 15,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 63,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '16 x 13 x 11 cm',
    printTime: '11 hs 30 min',
    colors: [
      { name: 'Plata Envejecida', hex: '#64748B' },
      { name: 'Negro Carbón', hex: '#18181B' },
      { name: 'Oro Viejo', hex: '#D97706' }
    ],
    tags: ['Jarras', 'Gótico', 'Calavera', 'Chopp'],
    isFeatured: true
  },
  {
    id: 'jarra-dragon-medieval-fantasia-3d',
    name: 'Jarra Dragón Medieval con Escamas y Ojos en Relieve',
    slug: 'jarra-dragon-medieval-fantasia-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra chopp de fantasía épica con textura de escamas de dragón y mango con forma de cola.',
    longDescription: 'Ideal para fanáticos del rol, D&D y temática medieval. Fabricada con filamentos silk bicapa de alta definición y terminación brillante.',
    price: 14200,
    originalPrice: 16800,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    rating: 5.0,
    reviewsCount: 39,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '17 x 14 x 11 cm',
    printTime: '12 hs',
    colors: [
      { name: 'Verde Dragón Silk', hex: '#047857' },
      { name: 'Rojo Carmesí', hex: '#DC2626' },
      { name: 'Negro & Cobre', hex: '#18181B' }
    ],
    tags: ['Jarras', 'Dragón', 'Fantasía', 'Medieval']
  },
  {
    id: 'jarra-chopp-futbol-clubes-3d',
    name: 'Chopp Escudo Club de Fútbol 3D con Inserto para Lata',
    slug: 'jarra-chopp-futbol-clubes-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Chopp cervecero con escudo tridimensional en relieve y colores oficiales de tu club.',
    longDescription: 'Jarra pasión futbolera con grabado en alto relieve de escudos de Primera División. Diseñada con fondo con aireador y calce hermético para latas.',
    price: 12900,
    originalPrice: 14900,
    isOffer: true,
    discountPercent: 13,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 77,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '16 x 13 x 10 cm',
    printTime: '10 hs 30 min',
    colors: [
      { name: 'Azul y Oro', hex: '#1E3A8A' },
      { name: 'Rojo y Blanco', hex: '#DC2626' },
      { name: 'Negro y Celeste', hex: '#0284C7' }
    ],
    tags: ['Jarras', 'Fútbol', 'Clubes', 'Chopp']
  },
  {
    id: 'jarra-chopp-motor-v8-mecanico-3d',
    name: 'Jarra Chopp Motor V8 & Pistones Mecánica 3D',
    slug: 'jarra-chopp-motor-v8-mecanico-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Jarra industrial con relieve de pistones, engranajes y múltiple de escape cromado.',
    longDescription: 'Para fanáticos de los autos, motos y la ingeniería. Textura metálica ultra definida con mango anatómico con forma de llave inglesa.',
    price: 13800,
    originalPrice: 16000,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: 31,
    inStock: true,
    printMaterial: 'PETG Carbon',
    dimensions: '17 x 13 x 11 cm',
    printTime: '11 hs',
    colors: [
      { name: 'Gris Titanio', hex: '#475569' },
      { name: 'Negro Matte', hex: '#18181B' },
      { name: 'Rojo Racing', hex: '#B91C1C' }
    ],
    tags: ['Jarras', 'Motor', 'V8', 'Mecánica']
  },
  {
    id: 'jarra-termica-personalizada-tapa-3d',
    name: 'Jarra Vaso Térmico 3D con Tapa Antiderrame y Grip Ergonómico',
    slug: 'jarra-termica-personalizada-tapa-3d',
    category: 'jarras',
    categoryLabel: 'Jarras',
    description: 'Vaso jarra térmica con grip geométrico facetado y tapa a rosca de sellado hermético.',
    longDescription: 'Diseñada para café, bebidas frías o tereré. Mantiene la temperatura durante horas gracias a su doble pared aislante interior.',
    price: 11500,
    originalPrice: 13200,
    isOffer: true,
    discountPercent: 12,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    printMaterial: 'PETG Food Grade',
    dimensions: '18 x 9 x 9 cm',
    printTime: '8 hs 45 min',
    colors: [
      { name: 'Negro & Naranja', hex: '#EA580C' },
      { name: 'Verde Militar', hex: '#3F6212' },
      { name: 'Gris Nube', hex: '#94A3B8' }
    ],
    tags: ['Jarras', 'Térmico', 'Vaso', 'Personalizado']
  },

  // --- CERÁMICA ---
  {
    id: 'set-sellos-texturadores-ceramica',
    name: 'Kit de 8 Sellos y Rodillos Texturadores para Cerámica',
    slug: 'set-sellos-texturadores-ceramica',
    category: 'ceramica',
    categoryLabel: 'Cerámica',
    description: 'Set de texturadores con patrones botánicos, geométricos y tribales para pastas cerámicas.',
    longDescription: 'Diseñados especialmente para artesanos y alfareros. Filo y relieve con ángulo de desmolde optimizado para no adherirse a la arcilla húmeda ni desgarrar las piezas.',
    price: 8900,
    originalPrice: 11000,
    isOffer: true,
    discountPercent: 19,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 4.9,
    reviewsCount: 73,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: 'Longitud 10 cm c/u (8 piezas)',
    printTime: '6 hs',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Beige Cerámica', hex: '#E5E0D8' },
      { name: 'Negro Mate', hex: '#18181B' }
    ],
    tags: ['Cerámica', 'Alfarería', 'Herramientas', 'Artesanal', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'herramientas-desbastadores-modelado-arcilla',
    name: 'Set de Desbastadores y Estecas 3D para Modelado y Torno',
    slug: 'herramientas-desbastadores-modelado-arcilla',
    category: 'ceramica',
    categoryLabel: 'Cerámica',
    description: 'Herramientas de perfilado anatómicas para torno alfarero y modelado escultórico.',
    longDescription: 'Juego de 6 estecas ergonómicas ultralivianas con diferentes curvas y perfiles de corte para vaciado y pulido de piezas de cerámica.',
    price: 6400,
    originalPrice: 7800,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: 41,
    inStock: true,
    printMaterial: 'PETG',
    dimensions: '14 x 3 x 0.8 cm (set x6)',
    printTime: '3 hs 40 min',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Gris Grafito', hex: '#4B5563' }
    ],
    tags: ['Cerámica', 'Torno', 'Estecas']
  },

  // --- CORTANTES ---
  {
    id: 'pack-cortantes-galletitas-reposteria',
    name: 'Pack x6 Cortantes de Galletitas / Fondant con Marcador',
    slug: 'pack-cortantes-galletitas-reposteria',
    category: 'cortantes',
    categoryLabel: 'Cortantes',
    description: 'Cortadores con eyector y marcador de relieve de alta definición para masas y repostería.',
    longDescription: 'Corte limpio con filo cónico de 0.4mm que evita rebabas en la masa. Aptos para galletitas, fondant, pasta de azúcar, porcelana fría y masa de sal.',
    price: 5800,
    originalPrice: 7200,
    isOffer: true,
    discountPercent: 19,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 5.0,
    reviewsCount: 119,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '7.5 x 7.5 x 1.5 cm c/u',
    printTime: '4 hs',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Rosa Pastel', hex: '#F472B6' },
      { name: 'Blanco Puro', hex: '#FFFFFF' }
    ],
    tags: ['Cortantes', 'Repostería', 'Galletitas', 'Cocina', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'cortante-personalizado-logo-nombre',
    name: 'Cortante Marcador Personalizado con Nombre o Logo',
    slug: 'cortante-personalizado-logo-nombre',
    category: 'cortantes',
    categoryLabel: 'Cortantes',
    description: 'Cortador a medida con tu marca, logotipo o tipografía preferida para eventos y emprendimientos.',
    longDescription: 'Enviá tu logo o la palabra que quieras y lo convertimos en un cortante 3D con sello marcador integrado listo para estampar en masas o cerámica.',
    price: 4500,
    originalPrice: 5500,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 96,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '8 x 8 x 1.5 cm',
    printTime: '1 h 30 min',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Verde Menta', hex: '#34D399' }
    ],
    tags: ['Cortantes', 'Personalizado', 'Emprendedores'],
    isFeatured: true
  },

  // --- MATE ---
  {
    id: 'mate-imperial-3d-polimero-termico',
    name: 'Mate Imperial 3D con Inserto Térmico de Polímero y Virola Grabada',
    slug: 'mate-imperial-3d-polimero-termico',
    category: 'mate',
    categoryLabel: 'Mate',
    description: 'Mate ergonómico térmico con vaso interno desmontable de fácil vaciado y virola con relieve personalizable.',
    longDescription: 'Diseñado para los amantes del mate que buscan practicidad y diseño de vanguardia. Su doble pared mantiene la temperatura por más tiempo sin calentar el exterior. No genera hongos ni absorbe olores.',
    price: 8900,
    originalPrice: 10900,
    isOffer: true,
    discountPercent: 18,
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 5.0,
    reviewsCount: 142,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '10 x 9 x 9 cm',
    printTime: '5 hs 30 min',
    colors: [
      { name: 'Negro & Oro', hex: '#18181B' },
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Verde Militar', hex: '#3F6212' }
    ],
    tags: ['Mate', 'Térmico', 'Imperial', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'mate-geometrico-facetado-3d',
    name: 'Mate Geométrico Facetado 3D Minimalista con Vaciado Fácil',
    slug: 'mate-geometrico-facetado-3d',
    category: 'mate',
    categoryLabel: 'Mate',
    description: 'Diseño geométrico de facetas poligonales con centro térmico y base plana antivuelco.',
    longDescription: 'Estilo moderno para el escritorio o el mate diario. Incluye inserto de polímero virgen atóxico resistente al agua hirviendo y bombilla de acero inoxidable de regalo.',
    price: 7600,
    originalPrice: 9200,
    isOffer: true,
    discountPercent: 17,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '9.5 x 8.5 x 8.5 cm',
    printTime: '4 hs',
    colors: [
      { name: 'Blanco Mármol', hex: '#F3F4F6' },
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Gris Carbón', hex: '#374151' }
    ],
    tags: ['Mate', 'Geométrico', 'Diseño']
  },
  {
    id: 'mate-camionero-personalizado-logo',
    name: 'Mate Camionero 3D con Escudo / Logo Personalizado',
    slug: 'mate-camionero-personalizado-logo',
    category: 'mate',
    categoryLabel: 'Mate',
    description: 'Boca ancha tipo camionero con escudo de fútbol, marca empresarial o iniciales en relieve.',
    longDescription: 'Ideal para yerba con palo y cebadas duraderas. Fabricado con bioplástico reforzado de alta densidad con virola personalizada.',
    price: 9500,
    originalPrice: 11500,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: 67,
    inStock: true,
    printMaterial: 'PETG',
    dimensions: '11 x 10 x 10 cm',
    printTime: '6 hs',
    colors: [
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Azul Marino', hex: '#1E3A8A' },
      { name: 'Naranja Thunder', hex: '#EA580C' }
    ],
    tags: ['Mate', 'Camionero', 'Personalizado']
  },

  // --- LLAVEROS 3D ---
  {
    id: 'pack-llaveros-3d-souvenirs-personalizados',
    name: 'Pack x20 Llaveros 3D Personalizados para Eventos / Marcas',
    slug: 'pack-llaveros-3d-souvenirs-personalizados',
    category: 'llaveros',
    categoryLabel: 'Llaveros 3D',
    description: 'Llaveros con relieve de doble color, argolla sinfín de acero y grabado de tu marca o fecha.',
    longDescription: 'La solución perfecta para cumpleaños, casamientos, egresados o merchandising corporativo. Acabado de precisión con capas bicolores ultra definidas.',
    price: 11900,
    originalPrice: 15000,
    isOffer: true,
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 5.0,
    reviewsCount: 165,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '5.5 x 3.5 x 0.4 cm c/u (pack x20)',
    printTime: '4 hs',
    colors: [
      { name: 'Naranja & Negro', hex: '#EA580C' },
      { name: 'Blanco & Dorado', hex: '#FFFFFF' },
      { name: 'Colores Surtidos', hex: '#3B82F6' }
    ],
    tags: ['Llaveros', 'Souvenirs', 'Personalizado', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'llavero-3d-dragon-articulado-flexible',
    name: 'Llavero 3D Dragón Articulado Flexible Print-in-Place',
    slug: 'llavero-3d-dragon-articulado-flexible',
    category: 'llaveros',
    categoryLabel: 'Llaveros 3D',
    description: 'Pieza articulada impresa en una sola tanda con movimiento fluido y argolla reforzada.',
    longDescription: 'Fabricado con tecnología print-in-place sin ensambles manuales. Movimiento antiestrés hipnótico y filamento silk brillante tornasolado.',
    price: 2800,
    originalPrice: 3500,
    isOffer: true,
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 94,
    inStock: true,
    printMaterial: 'PLA+ Silk',
    dimensions: '12 x 2.5 x 2 cm',
    printTime: '1 h 40 min',
    colors: [
      { name: 'Arcoíris Silk', hex: '#8B5CF6' },
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Verde Esmeralda', hex: '#059669' }
    ],
    tags: ['Llaveros', 'Articulado', 'Antiestrés']
  },
  {
    id: 'llavero-3d-destapador-reforzado-metal',
    name: 'Llavero 3D Destapador Reforzado con Inserto Metálico',
    slug: 'llavero-3d-destapador-reforzado-metal',
    category: 'llaveros',
    categoryLabel: 'Llaveros 3D',
    description: 'Destapador ultra resistente con alma de moneda/chapa metálica oculta y diseño ergonómico.',
    longDescription: 'Compacto, liviano y con fuerza de palanca probada para abrir más de 1.000 botellas sin deformarse. Personalizable con logos.',
    price: 2400,
    originalPrice: 2900,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    printMaterial: 'PETG',
    dimensions: '7 x 3.5 x 1.2 cm',
    printTime: '45 min',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Negro Carbón', hex: '#18181B' },
      { name: 'Rojo Fuego', hex: '#DC2626' }
    ],
    tags: ['Llaveros', 'Destapador', 'Utilidad']
  },

  // --- BOTELLAS CORTADAS ---
  {
    id: 'set-vasos-botellas-cortadas-recicladas',
    name: 'Set x4 Vasos Artesanales de Botellas Cortadas y Pulidas al Fuego',
    slug: 'set-vasos-botellas-cortadas-recicladas',
    category: 'botellas-cortadas',
    categoryLabel: 'Botellas Cortadas',
    description: 'Juego de 4 vasos confeccionados a partir de botellas de cerveza y gin recicladas con bordes pulidos a diamante y fuego.',
    longDescription: 'Ecológicos, únicos y resistentes. Cada botella es cortada milimétricamente y pulida en 4 pasos para garantizar un borde 100% suave, seguro y placentero al beber. Ideal para tragos, birra o agua.',
    price: 9900,
    originalPrice: 12500,
    isOffer: true,
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80'
    ],
    rating: 5.0,
    reviewsCount: 110,
    inStock: true,
    printMaterial: 'Vidrio Reciclado + Base 3D',
    dimensions: '14 cm alto x 7 cm diám. (450ml c/u)',
    printTime: 'Artesanal',
    colors: [
      { name: 'Verde Heineken / Corona', hex: '#166534' },
      { name: 'Ámbar Artesanal', hex: '#B45309' },
      { name: 'Transparente Gin', hex: '#E2E8F0' }
    ],
    tags: ['Botellas Cortadas', 'Reciclado', 'Vasos', 'Destacado'],
    isFeatured: true
  },
  {
    id: 'lampara-velador-botella-cortada-base-3d',
    name: 'Lámpara Velador Vintage con Botella Cortada y Base 3D LED',
    slug: 'lampara-velador-botella-cortada-base-3d',
    category: 'botellas-cortadas',
    categoryLabel: 'Botellas Cortadas',
    description: 'Velador de luz cálida con campana de botella cortada, base impresa en 3D y switch USB.',
    longDescription: 'Una pieza de iluminación sustentable con estética industrial. La luz LED refracta en el vidrio creando un ambiente cálido y relajante para living, bar o dormitorio.',
    price: 14900,
    originalPrice: 17800,
    isOffer: true,
    discountPercent: 16,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: 53,
    inStock: true,
    printMaterial: 'PETG + Vidrio Reciclado',
    dimensions: '22 x 10 x 10 cm',
    printTime: '6 hs',
    colors: [
      { name: 'Base Negra & Vidrio Ámbar', hex: '#18181B' },
      { name: 'Base Naranja & Vidrio Verde', hex: '#EA580C' }
    ],
    tags: ['Botellas Cortadas', 'Lámpara', 'Iluminación']
  },
  {
    id: 'maceta-autorriego-botella-cortada-soporte-3d',
    name: 'Maceta Auto-Riegable de Botella de Vidrio Invertida con Soporte 3D',
    slug: 'maceta-autorriego-botella-cortada-soporte-3d',
    category: 'botellas-cortadas',
    categoryLabel: 'Botellas Cortadas',
    description: 'Sistema hidropónico y auto-riego con mecha de algodón para plantas de interior y suculentas.',
    longDescription: 'Mantiene la humedad óptima para tus plantas por hasta 15 días sin necesidad de regar diariamente. Estructura de soporte 3D encastrable.',
    price: 6800,
    originalPrice: 8200,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: 47,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: '16 x 8 x 8 cm',
    printTime: '3 hs 15 min',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Blanco Puro', hex: '#FFFFFF' }
    ],
    tags: ['Botellas Cortadas', 'Macetas', 'Plantas']
  },

  // --- PERSONALIZADOS ---
  {
    id: 'proyecto-personalizado-a-medida-3d',
    name: 'Fabricación y Modelado 3D a Medida (Boceto / CAD / Prototipo)',
    slug: 'proyecto-personalizado-a-medida-3d',
    category: 'personalizados',
    categoryLabel: 'Personalizados',
    description: 'Diseñamos e imprimimos tu idea: jarras, mates, llaveros, cortantes o herramientas de cerámica exclusivas.',
    longDescription: 'Cotización personalizada según peso en gramos, tiempo de impresión y material elegido (PLA+, PETG, Flex). Te enviamos vista previa en 3D antes de imprimir.',
    price: 15000,
    originalPrice: 18000,
    isOffer: false,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1633493763347-1959328eb970?auto=format&fit=crop&w=700&q=80',
    rating: 5.0,
    reviewsCount: 130,
    inStock: true,
    printMaterial: 'PLA+',
    dimensions: 'A convenir según diseño',
    printTime: 'Según proyecto',
    colors: [
      { name: 'Naranja Thunder', hex: '#EA580C' },
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Blanco Glaciar', hex: '#FFFFFF' }
    ],
    tags: ['Personalizado', 'Taller', 'Diseño'],
    isFeatured: true
  }
];

export const BENEFITS = [
  {
    id: 'calidad',
    title: 'Impresión de Calidad',
    description: 'Impresoras calibradas de última generación con resolución de hasta 0.1mm y filamentos premium importados.',
    iconName: 'ShieldCheck',
    badge: 'Resolución HD'
  },
  {
    id: 'disenos',
    title: 'Diseños Personalizados',
    description: 'Modelamos tu idea desde un boceto, foto o archivo CAD para crear una pieza única e irrepetible.',
    iconName: 'Sparkles',
    badge: '100% a medida'
  },
  {
    id: 'produccion',
    title: 'Producción Rápida',
    description: 'Capacidad de granja de impresión activa 24/7 para despachar pedidos estándar en 24 a 48 hs.',
    iconName: 'Zap',
    badge: '24/48 hs'
  },
  {
    id: 'atencion',
    title: 'Atención Personalizada',
    description: 'Asesoramiento técnico directo por WhatsApp para elegir el material, resistencia y acabado ideal.',
    iconName: 'MessageSquareText',
    badge: 'Directo al taller'
  },
  {
    id: 'envios',
    title: 'Envíos solamente en CABA',
    description: 'Entregas rápidas por motomensajería express en Capital Federal (CABA) en 24/48 hs.',
    iconName: 'Truck',
    badge: 'Solamente en CABA'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Elegí o personalizá',
    description: 'Explorá nuestro catálogo de jarras, mates, cortantes, cerámica, llaveros y botellas cortadas, o envianos tu idea a medida.',
    iconName: 'Layers'
  },
  {
    step: '02',
    title: 'Coordinamos los detalles',
    description: 'Elegís colores, medidas y acordamos el pago con Mercado Pago, transferencia bancaria o efectivo.',
    iconName: 'MessageCircle'
  },
  {
    step: '03',
    title: 'Fabricamos tu producto',
    description: 'Iniciamos la impresión 3D o el corte artesanal en nuestro taller con control de calidad continuo.',
    iconName: 'Cpu'
  },
  {
    step: '04',
    title: 'Recibilo en tu puerta',
    description: 'Te enviamos el producto embalado con máxima protección directo a tu domicilio o punto de retiro.',
    iconName: 'PackageCheck'
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Martín Gómez',
    role: 'Coleccionista cervecero',
    comment: 'Los chopps vikingos y los vasos de botellas cortadas son espectaculares. El pulido del borde no lastima nada y la jarra 3D tiene un detalle de relieve tremendo.',
    rating: 5,
    city: 'Palermo, CABA'
  },
  {
    id: '2',
    name: 'Camila Rossi',
    role: 'Taller de Cerámica & Alfarería',
    comment: 'Los sellos texturadores y estecas para torno nos cambiaron la producción del taller. No se pegan a la arcilla húmeda y tienen un filo perfecto.',
    rating: 5,
    city: 'Belgrano, CABA'
  },
  {
    id: '3',
    name: 'Lucía Fernández',
    role: 'Emprendedora Pastelera',
    comment: 'Pedí cortantes personalizados con el logo de mi pastelería y un lote de llaveros 3D de souvenir. La nitidez de las letras es impresionante.',
    rating: 5,
    city: 'Mataderos, CABA'
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'envios' | 'personalizados' | 'mayoristas';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: '¿Qué materiales utilizan para la impresión 3D?',
    answer: 'Trabajamos principalmente con PLA+ (bioplástico biodegradable derivado del almidón de maíz, ecológico y seguro), PETG (altísima resistencia mecánica y térmica) y TPU Flexible (para piezas que requieren elasticidad). Para piezas que van en contacto con bebidas (mates y chopps), usamos insertos de polímero virgen atóxico o vasos térmicos.',
    category: 'general'
  },
  {
    id: '2',
    question: '¿Cómo son los envíos en CABA y al resto del país?',
    answer: 'En Capital Federal (CABA) realizamos envíos express por motomensajería propia con entregas en 24 a 48 hs. Para Gran Buenos Aires y el resto de la Argentina, despachamos a través de Correo Argentino y Andreani con número de seguimiento online.',
    category: 'envios'
  },
  {
    id: '3',
    question: '¿Puedo pedir un cortante, llavero o mate con mi propio logo?',
    answer: '¡Sí, totalmente! Solo tenés que enviarnos tu imagen, logo en vector o boceto por WhatsApp o a través de la sección "A Medida". Nosotros modelamos el archivo 3D, te mostramos un render digital previo para tu aprobación y luego lo mandamos a producción.',
    category: 'personalizados'
  },
  {
    id: '4',
    question: '¿Cómo funciona la venta mayorista y qué descuentos ofrecen?',
    answer: 'Ofrecemos escalas de descuento por cantidad: 20% OFF a partir de 10 unidades, 30% OFF a partir de 25 unidades y 40% OFF a partir de 50 unidades (pueden ser surtidos o del mismo modelo). Ideal para revendedores, cervecerías, pastelerías, eventos y empresas.',
    category: 'mayoristas'
  },
  {
    id: '5',
    question: '¿Los vasos de botellas cortadas son seguros para tomar?',
    answer: 'Absolutamente. Cada botella reciclada pasa por un proceso de corte por diamante y un tratamiento de pulido térmico y lijado en 4 granos sucesivos. El borde queda 100% redondeado, suave al tacto y totalmente seguro para labios y boca.',
    category: 'general'
  },
  {
    id: '6',
    question: '¿Qué medios de pago aceptan?',
    answer: 'Aceptamos Mercado Pago (tarjetas de crédito, débito, dinero en cuenta), transferencias bancarias directas (con 10% de descuento adicional) y efectivo al retirar en nuestro taller de Mataderos, CABA.',
    category: 'general'
  }
];

export const WHOLESALE_TIERS = [
  {
    id: 'pack-corporate-llaveros',
    title: 'Pack Llaveros Souvenir',
    minUnits: 'DESDE 30 UNIDADES',
    discount: '20% OFF',
    subtitle: 'Para marcas, eventos, souvenirs, cumpleaños, clubes y cervecerías 🎁 🔑',
    description: 'Para marcas, eventos, souvenirs, cumpleaños, clubes y cervecerías.',
    features: [
      'Personalización con logo o diseño sin cargo',
      'Argollas y cadenitas metálicas reforzadas incluidas',
      'Bolsitas individuales para cada unidad',
      'Modelos, tipografías y colores surtidos a elección',
      'Tiempo de entrega ágil: 3 a 5 días hábiles'
    ]
  },
  {
    id: 'pack-comercio-jarras',
    title: 'Pack Comercio / Local',
    minUnits: 'DESDE 25 UNIDADES',
    discount: '30% OFF',
    subtitle: 'Especial jarras chop y cortadas para cervecerías, bares y locales 🍺 🍕',
    description: 'Especial jarras chop y jarras cortadas para cervecerías, bares, bazares y locales comerciales.',
    popular: true,
    badge: 'Más Elegido',
    features: [
      'Jarras chop y jarras cortadas a elección',
      'Diseños temáticos surtidos (fútbol, series, gaming) o logo propio',
      'Incluye vaso interior térmico / apto alimentos (BPA Free)',
      'Grabado de marca en relieve sin cargo adicional',
      'Prioridad en la línea de producción y despacho',
      'Envío bonificado en CABA en compras mayoristas'
    ]
  },
  {
    id: 'pack-vip-volumen',
    title: 'Pack Llaveros VIP & Corporativo',
    minUnits: 'DESDE 50 UNIDADES',
    discount: '15% OFF',
    subtitle: 'Para grandes distribuidores, eventos masivos y merchandising corporativo 🏢 🎁',
    description: 'Para grandes distribuidores, eventos masivos y merchandising corporativo.',
    badge: 'Máximo Margen',
    features: [
      'Precio de costo por volumen y máxima rentabilidad',
      'Desarrollo y grabado de matrices exclusivas para tu marca',
      'Argollas reforzadas y packaging individual premium listo para entrega',
      'Despacho bonificado en CABA',
      'Atención ejecutiva prioritaria y muestra previa sin cargo'
    ]
  }
];
