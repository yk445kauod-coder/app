'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToR2 } from '@/lib/r2';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0, category: '', image_url: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const url = await uploadToR2(file, fileName);
      setNewProduct({ ...newProduct, image_url: url });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Make sure R2 env vars are set.');
    } finally {
      setUploading(false);
    }
  }

  async function handleAddProduct() {
    if (!newProduct.name || newProduct.price <= 0) return;
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) alert(error.message);
    else {
      setNewProduct({ name: '', price: 0, category: '', image_url: '' });
      fetchProducts();
    }
  }

  async function handleDeleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchProducts();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Product Management</h2>

      <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-foreground"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Category</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-foreground"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Price</label>
            <input
              type="number"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-foreground"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-1">
             <label className="block text-sm font-medium text-foreground">Product Image</label>
             <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="image-upload"
                  className="w-full p-2 border border-dashed rounded cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-foreground"
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                  {newProduct.image_url ? 'Change Image' : 'Upload Image'}
                </label>
             </div>
          </div>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-bold w-full md:w-auto"
        >
          <Plus size={18} /> Add Product to Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-foreground">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">No products found. Start by adding one above!</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4 border rounded-xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-pink-500 font-bold">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id!)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
