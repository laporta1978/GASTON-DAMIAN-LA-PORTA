export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  avatar?: string;
  rating: number;
  comment: string;
  purchasedProduct: string;
  productImage: string;
  highlightTag: string;
  date: string;
  verifiedPurchase: boolean;
  featured?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Facundo Morales',
    role: 'Gamer & Streamer',
    city: 'Palermo, CABA',
    avatar: '',
    rating: 5,
    comment: 'Pedí el soporte para joystick y auriculares con acabado negro mate y detalles en naranja. La calidad de impresión es impecable, sin marcas de capas ni rebabas. Quedó espectacular en mi setup.',
    purchasedProduct: 'Soporte Gamer Cyberpunk Auricular & Joystick',
    productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    highlightTag: 'Acabado Impecable 10/10',
    date: 'Hace 3 días',
    verifiedPurchase: true,
    featured: true
  },
  {
    id: 'test-2',
    name: 'Camila Rossi',
    role: 'Diseñadora de Interiores',
    city: 'Belgrano, CABA',
    avatar: '',
    rating: 5,
    comment: 'Compré el set de macetas facetadas geométricas para un proyecto de ambientación. El filamento mármol tiene una textura suave increíble y son súper resistentes. El envío en moto llegó al día siguiente.',
    purchasedProduct: 'Set Macetas Facetadas Nórdicas Mármol',
    productImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
    highlightTag: 'Textura Mármol Premium',
    date: 'Hace 5 días',
    verifiedPurchase: true
  },
  {
    id: 'test-3',
    name: 'Ignacio Benítez',
    role: 'Arquitecto & Modelador 3D',
    city: 'Capital Federal',
    avatar: '',
    rating: 5,
    comment: 'Les envié un archivo .STL para una maqueta estructural a escala. Me asesoraron con el tipo de relleno (infill) y usaron PETG de alta tenacidad. La precisión dimensional fue milimétrica. Unos grosos totales.',
    purchasedProduct: 'Impresión Personalizada Maqueta PETG',
    productImage: '/images/maqueta_arquitectura_3d.jpg',
    highlightTag: 'Precisión Milimétrica',
    date: 'Hace 1 semana',
    verifiedPurchase: true,
    featured: true
  },
  {
    id: 'test-4',
    name: 'Sofía Álvarez',
    role: 'Coleccionista Pop Culture',
    city: 'Almagro, CABA',
    avatar: '',
    rating: 5,
    comment: 'El Dragón Articulado Imperial es una obra de arte. Las articulaciones se mueven con total fluidez recién sacado de la caja y el color seda tornasolado brilla según cómo le dé la luz. ¡Compraré más para regalar!',
    purchasedProduct: 'Dragón Articulado Imperial Silk Dual-Color',
    productImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    highlightTag: 'Movimiento Perfecto',
    date: 'Hace 1 semana',
    verifiedPurchase: true
  },
  {
    id: 'test-5',
    name: 'Matías Gomez Peña',
    role: 'Desarrollador Software',
    city: 'Caballito, CABA',
    avatar: '',
    rating: 5,
    comment: 'Excelente experiencia de compra. La atención por WhatsApp fue rápida, me mostraron fotos del proceso de impresión en vivo y el empaque vino súper protegido con stickers y un llavero de cortesía.',
    purchasedProduct: 'Organizador Modular Escritorio con Carga Qi',
    productImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
    highlightTag: 'Atención 10/10 + Regalo',
    date: 'Hace 2 semanas',
    verifiedPurchase: true
  },
  {
    id: 'test-6',
    name: 'Lucía Fernández',
    role: 'Emprendedora Gastronómica',
    city: 'La Plata, Buenos Aires',
    avatar: '',
    rating: 5,
    comment: 'Mandé a hacer 50 cortantes de galletitas personalizados con el logo de mi pastelería en PLA apto alimentos. Quedaron exactos y la definición del borde de corte es perfecta. Clientes y yo felices.',
    purchasedProduct: 'Lote de Cortantes Personalizados con Logo',
    productImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    highlightTag: 'Producción en Serie Rápida',
    date: 'Hace 2 semanas',
    verifiedPurchase: true
  }
];

export const TESTIMONIALS_METRICS = {
  averageRating: 4.96,
  totalReviews: 480,
  satisfactionRate: '99.4%',
  repeatBuyersRate: '42%',
  starBreakdown: [
    { stars: 5, percentage: 96 },
    { stars: 4, percentage: 4 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 }
  ]
};
