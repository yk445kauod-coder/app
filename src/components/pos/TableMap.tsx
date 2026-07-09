'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  seats: number;
}

const MOCK_TABLES: Table[] = [
  { id: 't1', number: 1, status: 'available', seats: 2 },
  { id: 't2', number: 2, status: 'occupied', seats: 4 },
  { id: 't3', number: 3, status: 'available', seats: 4 },
  { id: 't4', number: 4, status: 'reserved', seats: 2 },
  { id: 't5', number: 5, status: 'available', seats: 6 },
];

export default function TableMap() {
  const t = useTranslations('tables');
  const [tables] = useState<Table[]>(MOCK_TABLES);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Floor Plan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`
              h-32 w-32 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer
              ${table.status === 'available' ? 'bg-green-50 border-green-200 hover:bg-green-100' : ''}
              ${table.status === 'occupied' ? 'bg-red-50 border-red-200 hover:bg-red-100' : ''}
              ${table.status === 'reserved' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' : ''}
            `}
          >
            <span className="text-2xl font-bold">{table.number}</span>
            <span className="text-xs uppercase font-medium">{table.status}</span>
            <span className="text-[10px] mt-1">{table.seats} Seats</span>
          </div>
        ))}
      </div>
    </div>
  );
}
