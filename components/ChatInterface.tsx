import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, ArrowUp, MessageSquareDashed } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const BOT_RESPONSES = [
  "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI responds, the page jumps!",
  "That sounds like a classic scroll anchor issue. Have you tried using overflow-anchor: none on the container, or manually scrolling to a ref?",
  "Ah, using a ref for the end of the messages list and calling scrollIntoView is the most robust way to handle it in React.",
  "That's exactly it. With Framer Motion it looks buttery smooth. Anything else on your mind today?"
];

// Reusable spring configuration for that highly-polished bounce
const springConfig = { type: "spring", bounce: 0.35, duration: 0.5 };

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: BOT_RESPONSES[responseIndex % BOT_RESPONSES.length]
      };
      setMessages(prev => [...prev, botMessage]);
      setResponseIndex(prev => prev + 1);
    }, 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setIsTyping(false);
    setInputValue("");
    setResponseIndex(0);
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      {/* Phone/Widget Container */}
      <div className="w-full max-w-[400px] h-[750px] bg-[#121212] rounded-[32px] border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#121212] z-10">
          <div className="flex flex-col">
            <span className="text-white font-semibold text-lg">New Chat</span>
            <span className="text-zinc-400 text-sm">How can I help you today?</span>
          </div>
          <button 
            onClick={handleReset}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 && !isTyping ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center -mt-10"
            >
              <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquareDashed className="w-6 h-6 text-zinc-300" />
              </div>
              <h2 className="text-white text-2xl font-medium mb-2 tracking-tight">Morning, shadcn!</h2>
              <p className="text-zinc-400 max-w-[260px] text-base leading-relaxed">
                What are we working on today? Press send to start a new conversation
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20, originX: msg.role === 'user' ? 1 : 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={springConfig}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-zinc-800 text-zinc-100 rounded-br-sm' 
                          : 'bg-transparent text-zinc-300 px-0'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20, originX: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={springConfig}
                    className="flex justify-start"
                  >
                    <div className="bg-transparent text-zinc-300 py-3.5 flex gap-1.5 items-center h-[52px]">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: dot * 0.15,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-[#121212] z-10 pt-2">
          <form 
            onSubmit={handleSend}
            className="relative flex flex-col bg-[#1c1c1c] rounded-3xl p-2 border border-white/5 focus-within:border-white/20 transition-colors"
          >
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="I'm building a chat for our app..."
              className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 px-4 pt-3 pb-12 resize-none outline-none text-[15px] leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <button 
                type="button"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
