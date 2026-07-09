'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { firestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SetupWizard() {
  const t = useTranslations('setup');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cafe',
    currency: 'USD',
    language: 'en',
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save to Supabase
      const { error: sbError } = await supabase
        .from('settings')
        .insert([{ ...formData, created_at: new Date() }]);

      if (sbError) throw sbError;

      // Save to Firebase for real-time
      await setDoc(doc(firestore, 'restaurant', 'config'), formData);

      alert('Setup complete!');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Setup failed. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="mb-4 text-gray-600 dark:text-gray-400">{t('description')}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="cafe">Cafe</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleBack}
                className="flex-1 border p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
