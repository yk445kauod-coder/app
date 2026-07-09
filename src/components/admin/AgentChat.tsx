'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      const aiMessage: Message = { role: 'ai', text: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="p-4 bg-pink-500 text-white font-bold flex items-center gap-2">
        <Bot size={20} />
        AI Virtual Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl flex gap-2 ${
              msg.role === 'user' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
            }`}>
              {msg.role === 'ai' && <Bot size={16} className="shrink-0 mt-1" />}
              <p className="text-sm">{msg.text}</p>
              {msg.role === 'user' && <User size={16} className="shrink-0 mt-1" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none animate-pulse">
               Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
