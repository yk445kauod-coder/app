'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { database } from '@/lib/firebase';
import { ref, push, onValue, set, DataSnapshot } from 'firebase/database';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: number;
  likes: number;
  gifUrl?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSearchingGif, setIsSearchingGif] = useState(false);
  const [gifs, setGifs] = useState<string[]>([]);
  const [user] = useAtom(userAtom);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, message]) => ({
          id,
          ...(message as Omit<Message, 'id'>),
        }));
        setMessages(messageList.sort((a, b) => b.timestamp - a.timestamp));
      }
    });

    return () => {
      // Clean up subscription
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messagesRef = ref(database, 'messages');
    await push(messagesRef, {
      text: newMessage,
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      timestamp: Date.now(),
      likes: 0,
    });

    setNewMessage('');
  };

  const handleLikeMessage = async (messageId: string, currentLikes: number) => {
    const messageRef = ref(database, `messages/${messageId}/likes`);
    await set(messageRef, currentLikes + 1);
  };

  const searchGifs = async (query: string) => {
    const GIPHY_API_KEY = 'your_giphy_api_key';
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=10`
    );
    const data = await response.json();
    setGifs(data.data.map((gif: any) => gif.images.fixed_height.url));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-3 ${
              message.userId === user?.uid ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex flex-col max-w-[80%] ${
                message.userId === user?.uid
                  ? 'items-end bg-pink-500 text-white'
                  : 'items-start bg-gray-100 dark:bg-gray-800'
              } rounded-lg p-3`}
            >
              <span className="text-sm font-medium">{message.username}</span>
              <p className="text-sm mt-1">{message.text}</p>
              {message.gifUrl && (
                <div className="relative mt-2 w-[200px] h-[200px]">
                  <Image
                    src={message.gifUrl}
                    alt="GIF"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
                <button
                  onClick={() => handleLikeMessage(message.id, message.likes)}
                  className="hover:text-pink-500 transition-colors"
                >
                  ❤️ {message.likes}
                </button>
                <span>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {isSearchingGif && (
          <div className="mb-4 grid grid-cols-5 gap-2">
            {gifs.map((gif) => (
              <div
                key={gif}
                className="relative w-full h-20 cursor-pointer"
                onClick={() => {
                  setNewMessage((prev) => prev + ` ${gif} `);
                  setIsSearchingGif(false);
                  setGifs([]);
                }}
              >
                <Image
                  src={gif}
                  alt="GIF"
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSearchingGif(!isSearchingGif)}
            className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
          >
            GIF
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (isSearchingGif && e.target.value) {
                searchGifs(e.target.value);
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}