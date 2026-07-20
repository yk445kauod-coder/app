'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', price: 3.5, category: 'Coffee' },
  { id: '2', name: 'Cappuccino', price: 4.5, category: 'Coffee' },
  { id: '3', name: 'Latte', price: 4.0, category: 'Coffee' },
  { id: '4', name: 'Croissant', price: 2.5, category: 'Pastry' },
  { id: '5', name: 'Muffin', price: 3.0, category: 'Pastry' },
];

export default function ProductGrid({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  useTranslations('pos');

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {MOCK_PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
          onClick={() => onAddToCart(product)}
        >
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
            {product.image ? (
              <Image src={product.image} alt={product.name} width={100} height={100} className="rounded" />
            ) : (
              <span className="text-gray-400">Image</span>
            )}
          </div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-pink-500 font-bold">${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
