import TableMap from '@/components/pos/TableMap';

export default function TablesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
       <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold">Table Management</h1>
        </header>
        <TableMap />
    </div>
  );
}
