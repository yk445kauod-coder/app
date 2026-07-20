'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductGrid, { Product } from '@/components/pos/ProductGrid';
import Cart, { CartItem } from '@/components/pos/Cart';
import { database } from '@/lib/firebase';
import { ref, push } from 'firebase/database';

export default function POSTerminal() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const t = useTranslations('pos');

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeProduct = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    try {
      const ordersRef = ref(database, 'orders');
      await push(ordersRef, {
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        timestamp: Date.now(),
        status: 'pending'
      });
      setCartItems([]);
      alert(t('success'));
    } catch (error) {
      console.error(error);
      alert('Checkout failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      <div className="flex-1 overflow-y-auto">
        <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <div className="flex gap-2">
            {/* Language Switcher could go here */}
          </div>
        </header>
        <ProductGrid onAddToCart={addToCart} />
      </div>
      <Cart
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeProduct}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
