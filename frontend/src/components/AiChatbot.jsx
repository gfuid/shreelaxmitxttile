import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
  Minimize2,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi, productsApi } from '../services/api';

const QUICK_PROMPTS = [
  '🎀 Bridal Silk Sarees under ₹15,000',
  '✨ What is special about Gadwal Silk?',
  '🌸 Best Lightweight Sarees for Summer',
  '🚚 Delivery & COD Policy',
  '📍 Store Address in Hyderabad',
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_welcome',
    sender: 'bot',
    text: 'Namaste! 🙏 I am **Laxmi**, your personal AI Saree Stylist from Sri Vijaylaxmi Textiles (Hyderabad, Est. 1980).\n\nWhether you are searching for a bridal Gadwal Pattu, wedding Dharmavaram, or handloom daily wear, I am here to help you find the perfect weave! What are you shopping for today?',
    timestamp: new Date(),
  },
];

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load products for quick matching
  useEffect(() => {
    productsApi.getAll().then((res) => {
      if (res.data) setAllProducts(res.data.products || res.data || []);
    }).catch(() => {});
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build API messages payload
      const apiMessages = [
        ...messages
          .filter((m) => m.id !== 'msg_welcome')
          .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        { role: 'user', content: text },
      ];

      const res = await aiApi.chat(apiMessages);
      const replyText = res.message || 'Namaste! How else may I assist you with our handloom collection?';

      // Find matching products based on text
      const lower = text.toLowerCase();
      const matchedProds = allProducts.filter((p) => {
        return (
          lower.includes(p.category?.toLowerCase()) ||
          lower.includes(p.fabric?.toLowerCase()) ||
          (lower.includes('bridal') && (p.category?.includes('Dharmavaram') || p.category?.includes('Banaras'))) ||
          (lower.includes('gadwal') && p.category?.includes('Gadwal')) ||
          (lower.includes('cotton') && p.category?.includes('COTTON'))
        );
      }).slice(0, 2);

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        recommendedProducts: matchedProds.length > 0 ? matchedProds : null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: 'Namaste! 🙏 I am here to help. You can explore our pure Gadwal, Dharmavaram, and Banarasi silk sarees in the Shop section or ask me about any weave.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to format markdown text with bolding & line breaks
  const renderFormattedText = (txt) => {
    if (!txt) return null;
    const parts = txt.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-amber-200 font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#1C1917]/95 text-amber-200 text-xs font-bold px-3.5 py-2 rounded-full shadow-2xl border border-amber-400/40 cursor-pointer hover:border-amber-400 transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <Sparkles size={14} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Ask Laxmi AI Saree Stylist</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#700B1A] via-[#9F1239] to-[#D97706] text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center border-2 border-amber-400/60 group cursor-pointer"
            aria-label="Open AI Saree Stylist Chatbot"
          >
            <Sparkles size={24} className="text-amber-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></span>
          </button>
        </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-[#141211] text-gray-100 rounded-3xl border border-[#3E3834] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="h-16 px-4 bg-gradient-to-r from-[#700B1A] via-[#831843] to-[#1C1917] border-b border-amber-500/20 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-[#700B1A] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#1A0A0E] rounded-[14px] flex items-center justify-center text-amber-300 font-bold">
                  <Sparkles size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1A0A0E]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                    Laxmi • AI Saree Stylist
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                    GPT-4o
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/80">
                  Sri Vijaylaxmi Textiles • Hyderabad
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-300">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Restart Conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#0E0C0B] text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#700B1A] to-[#D97706] flex items-center justify-center text-amber-200 shrink-0 text-[10px] font-bold shadow">
                      ✨
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-[#700B1A] to-[#9F1239] text-white rounded-tr-xs'
                        : 'bg-[#1C1917] text-gray-200 border border-[#2E2824] rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>

                    {/* Product Recommendation Cards (if matched) */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#332E29] space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Recommended Weaves:
                        </span>
                        {msg.recommendedProducts.map((p) => {
                          const thumb = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image;
                          return (
                            <Link
                              key={p._id}
                              to={`/product/${p.slug || p._id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2.5 p-2 bg-[#262220] hover:bg-[#322D2A] rounded-xl border border-[#3E3834] transition-all group"
                            >
                              <img
                                src={thumb}
                                alt={p.title}
                                className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h5 className="text-[11px] font-bold text-white truncate group-hover:text-amber-300">
                                  {p.title}
                                </h5>
                                <span className="text-[10px] text-amber-400 font-bold block">
                                  ₹{Number(p.price).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <ExternalLink size={12} className="text-gray-400 group-hover:text-amber-300 shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <span className="block text-[9px] text-gray-500 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-[#700B1A] flex items-center justify-center text-amber-200 shrink-0">
                  <Sparkles size={13} className="animate-spin" />
                </div>
                <div className="bg-[#1C1917] border border-[#2E2824] px-3 py-2 rounded-2xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-gray-400 ml-1">Laxmi is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-[#141211] border-t border-[#262220] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-[#262220] hover:bg-[#332D29] border border-[#3E3834] text-[10px] text-amber-200 whitespace-nowrap transition-all shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#1C1917] border-t border-[#2C2724] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about sarees, bridal wear, silk..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#262220] border border-[#3E3834] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#700B1A] to-[#D97706] hover:opacity-95 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send size={16} className="text-amber-200" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AiChatbot;
