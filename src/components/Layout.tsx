'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { 
  ChatBubbleLeftIcon, 
  HomeIcon, 
  HeartIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  FireIcon,
  StarIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';
import { auth, database } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user] = useAtom(userAtom);
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/favorites', icon: HeartIcon, label: 'Favorites' },
    { href: '/profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-pink-500'
                    : 'text-gray-500 hover:text-pink-500'
                } transition-colors duration-200`}
              >
                <item.icon className="h-6 w-6" />
              </Link>
            ))}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="text-gray-500 hover:text-pink-500 transition-colors duration-200"
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-20 pt-4">{children}</main>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-x-0 bottom-16 z-30 h-96 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-2xl shadow-lg"
          >
            {/* Chat component will go here */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
              {/* Chat content */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}