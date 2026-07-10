import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowUp, MessageSquareDashed } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ADVENTURE_SCRIPT = [
  {
    user: "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI responds, the page jumps!",
    bot: "That sounds like a classic scroll anchor issue. Have you tried using overflow-anchor: none on the container, or manually scrolling to a ref?"
  },
  {
    user: "Ah, using a ref for the end of the messages list and calling scrollIntoView is the most robust way to handle it in React.",
    bot: "That's exactly it! And if you pair it with Framer Motion, it looks buttery smooth. Anything else on your mind today?"
  },
  {
    user: "Nope, that's all for now. Thanks!",
    bot: "You're welcome, Swastik! Let me know if you ever need any more help."
  }
];

// Reusable spring configuration for that highly-polished bounce
const springConfig = { type: "spring", bounce: 0.35, duration: 0.5 };

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // requestAnimationFrame ensures the DOM has updated and layout is calculated
    // before we try to scroll, preventing layout snapping/jitter.
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendNext = () => {
    if (isTyping || stepIndex >= ADVENTURE_SCRIPT.length) return;
    
    const currentStep = ADVENTURE_SCRIPT[stepIndex];
    
    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      role: 'user',
      content: currentStep.user
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        role: 'assistant',
        content: currentStep.bot
      };
      setMessages(prev => [...prev, botMessage]);
      setStepIndex(prev => prev + 1);
    }, 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setIsTyping(false);
    setStepIndex(0);
  };

  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="w-full min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        {/* Phone/Widget Container */}
        <div className="w-full max-w-[400px] h-[750px] bg-[#121212] rounded-[32px] border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#121212] z-10 shrink-0">
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
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 scroll-smooth">
            {messages.length === 0 && !isTyping ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center -mt-10"
              >
                <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquareDashed className="w-6 h-6 text-zinc-300" />
                </div>
                <h2 className="text-white text-2xl font-medium mb-2 tracking-tight">Welcome, Swastik!</h2>
                <p className="text-zinc-400 max-w-[260px] text-base leading-relaxed">
                  What are we working on today? Press send to start a new conversation.
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-6">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.8, y: 20, originX: msg.role === 'user' ? 1 : 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={springConfig}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-zinc-800 text-zinc-100 rounded-br-sm' 
                            : 'bg-zinc-800/40 text-zinc-300 rounded-bl-sm border border-white/5'
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
                      layout="position"
                      initial={{ opacity: 0, scale: 0.8, y: 20, originX: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={springConfig}
                      className="flex justify-start"
                    >
                      <div className="bg-zinc-800/40 border border-white/5 rounded-2xl rounded-bl-sm px-5 py-3.5 flex gap-1.5 items-center h-[52px]">
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
          <div className="p-4 bg-[#121212] z-10 pt-2 shrink-0">
            <button
              onClick={handleSendNext}
              disabled={isTyping || stepIndex >= ADVENTURE_SCRIPT.length}
              className="w-full relative flex items-center justify-between bg-[#1c1c1c] hover:bg-[#232323] active:scale-[0.98] rounded-3xl p-2 border border-white/5 transition-all text-left group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="px-4 py-2 text-[14px] text-zinc-400 line-clamp-1 pr-12">
                {stepIndex < ADVENTURE_SCRIPT.length 
                  ? ADVENTURE_SCRIPT[stepIndex].user 
                  : "Conversation ended"}
              </div>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-blue-500 transition-colors shadow-lg">
                <ArrowUp className="w-5 h-5" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
