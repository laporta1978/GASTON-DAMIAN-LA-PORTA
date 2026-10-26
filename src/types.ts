export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'jarras' | 'ceramica' | 'cortantes' | 'mate' | 'llaveros' | 'botellas-cortadas' | 'personalizados' | string;
  categoryLabel: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  isOffer?: boolean;
  discountPercent?: number;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount?: number;
  printMaterial: 'PLA+' | 'PETG' | 'Resina 4K' | 'TPU Flexible' | 'PLA+ Silk' | 'PLA Mármol' | string;
  dimensions: string;
  printTime: string;
  colors: { name: string; hex: string }[];
  tags: string[];
  isFeatured?: boolean;
  onDemandOnly?: boolean;
}

export interface Category {
  id: 'jarras' | 'ceramica' | 'cortantes' | 'mate' | 'llaveros' | 'botellas-cortadas' | 'personalizados' | string;
  name: string;
  description: string;
  image: string;
  count: number;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: { name: string; hex: string };
  customNotes?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  street: string;
  number: string;
  floorApt?: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  deliveryMethod: 'caba_express' | 'correo_argentino' | 'retiro_taller';
  paymentMethod: 'mercadopago' | 'transferencia' | 'efectivo';
  orderNotes?: string;
}

export interface OrderDetails {
  orderNumber: string;
  date: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  status: 'pendiente' | 'en_produccion' | 'enviado' | 'entregado';
}
