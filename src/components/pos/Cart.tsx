'use client';

import { useTranslations } from 'next-intl';
import { Trash2, Plus, Minus } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout
}: {
  items: CartItem[],
  onUpdateQuantity: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  onCheckout: () => void
}) {
  useTranslations('pos');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 w-80">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 font-bold text-xl">
        Current Order
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">Cart is empty</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 rounded bg-gray-100 dark:bg-gray-800"><Minus size={14}/></button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 rounded bg-gray-100 dark:bg-gray-800"><Plus size={14}/></button>
                <button onClick={() => onRemove(item.id)} className="p-1 text-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
