import type { ImageSourcePropType } from 'react-native';

export type CategoryId = 'coffee' | 'non-coffee' | 'pastries';

export type Product = {
  id: string;
  name: string;
  /** Copy shown on the full-width menu list. */
  description: string;
  /** Tighter copy shown on the home featured cards. */
  blurb: string;
  price: number;
  category: CategoryId;
  image: ImageSourcePropType;
  stock: number;
  /** Amber eyebrow on the home featured card. */
  featuredNote?: string;
};

export const products: Product[] = [
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    description: 'Double espresso, milk, and ice',
    blurb: 'Espresso, oat milk, maple',
    price: 120,
    category: 'coffee',
    image: require('@/assets/images/products/iced-latte.png'),
    stock: 24,
    featuredNote: 'Campus favorite',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso, milk, and foam',
    blurb: 'Steamed milk, cocoa dust',
    price: 110,
    category: 'coffee',
    image: require('@/assets/images/products/cappuccino.png'),
    stock: 18,
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    description: 'Espresso, milk, and caramel',
    blurb: 'Espresso, milk, and caramel',
    price: 135,
    category: 'coffee',
    image: require('@/assets/images/products/caramel-macchiato.png'),
    stock: 16,
    featuredNote: 'Fresh batch',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    description: 'Green tea latte with milk',
    blurb: 'Ceremonial matcha, oat milk',
    price: 130,
    category: 'non-coffee',
    image: require('@/assets/images/products/matcha-latte.png'),
    stock: 12,
    featuredNote: 'Seasonal pick',
  },
  {
    id: 'chocolate-frappe',
    name: 'Chocolate Frappe',
    description: 'Rich chocolate blended drink',
    blurb: 'Cocoa, cold milk, whipped cream',
    price: 125,
    category: 'non-coffee',
    image: require('@/assets/images/products/chocolate-frappe.png'),
    stock: 14,
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    description: 'Moist chocolate cake slice',
    blurb: 'Dark chocolate sponge',
    price: 90,
    category: 'pastries',
    image: require('@/assets/images/products/chocolate-cake.png'),
    stock: 10,
  },
  {
    id: 'croissant',
    name: 'Croissant',
    description: 'Flaky butter pastry',
    blurb: 'Baked this morning',
    price: 80,
    category: 'pastries',
    image: require('@/assets/images/products/croissant.png'),
    stock: 20,
  },
];

export const featuredProducts = products.filter((product) => product.featuredNote);

const productImages: Record<string, ImageSourcePropType> = {
  'iced-latte': require('@/assets/images/products/iced-latte.png'),
  cappuccino: require('@/assets/images/products/cappuccino.png'),
  'caramel-macchiato': require('@/assets/images/products/caramel-macchiato.png'),
  'matcha-latte': require('@/assets/images/products/matcha-latte.png'),
  'chocolate-frappe': require('@/assets/images/products/chocolate-frappe.png'),
  'chocolate-cake': require('@/assets/images/products/chocolate-cake.png'),
  croissant: require('@/assets/images/products/croissant.png'),
};

const categoryImages: Record<CategoryId, ImageSourcePropType> = {
  coffee: productImages['iced-latte'],
  'non-coffee': productImages['matcha-latte'],
  pastries: productImages.croissant,
};

export function getProductImage(imageKey: string, category: CategoryId): ImageSourcePropType {
  return productImages[imageKey] ?? categoryImages[category];
}

export type Category = {
  id: CategoryId;
  label: string;
};

export const categories: Category[] = [
  { id: 'coffee', label: 'Coffee' },
  { id: 'non-coffee', label: 'Non-Coffee' },
  { id: 'pastries', label: 'Pastries' },
];