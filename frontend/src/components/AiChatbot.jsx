import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  MapPin,
  Phone,
  ShoppingBag,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { aiApi, productsApi } from '../services/api';
import { SHOWROOM_INFO, getStylistResponse } from '../services/websiteStructure';
import logoImg from '../assets/logo.png';

const QUICK_PROMPTS = [
  '👑 Dharmavaram Bridal Silk',
  '✨ Designer Gadwal Pattu',
  '👰 Banaras Wed Cream',
  '📝 How to Place an Order?',
  '🚚 Track My Order',
  '📍 Showroom Address & Timings',
  '💬 WhatsApp Video Consultation',
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_welcome',
    sender: 'bot',
    text: `Namaste! 🙏 I am **Laxmi**, Senior Saree Consultant at **Sri Vijaylaxmi Textiles** (Rikab Gunj, Hyderabad • Est. 1980).\n\nWhether you are looking for pure bridal Dharmavaram, Gadwal Pattu, festive Ghagaras, or want to place a direct wholesale order, I am here to assist you!\n\nWhat would you like to explore today?`,
    actionLinks: [
      { label: '👑 Dharmavaram Bridal Pattu', path: '/shop?category=Dharmavaram+Pattu' },
      { label: '✨ Designer Gadwal Silk', path: '/shop?category=Designer+Pattu+Gadwal' },
      { label: '👰 Banaras Wed Cream', path: '/shop?category=Banaras+Wed+Cream' },
      { label: '📝 Direct Order Form', path: '/order-query' },
      { label: '📍 Store Location', path: '/contact' },
    ],
    timestamp: new Date(),
  },
];

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(1);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load products for quick matching
  useEffect(() => {
    productsApi
      .getAll()
      .then((res) => {
        if (res.data) setAllProducts(res.data.products || res.data || []);
      })
      .catch(() => {});
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
    // On small mobile screens, minimize or close chat so user can immediately view target page
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

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

      // Determine Action Links from response or fallback engine
      const localStructureResult = getStylistResponse(text);
      const actionLinks = res.actionLinks || localStructureResult.actionLinks || [];

      // Find matching products based on text
      const lower = text.toLowerCase();
      const matchedProds = allProducts
        .filter((p) => {
          return (
            lower.includes(p.category?.toLowerCase()) ||
            lower.includes(p.fabric?.toLowerCase()) ||
            (lower.includes('bridal') && (p.category?.includes('Dharmavaram') || p.category?.includes('Banaras'))) ||
            (lower.includes('gadwal') && p.category?.includes('Gadwal')) ||
            (lower.includes('cotton') && p.category?.includes('COTTON'))
          );
        })
        .slice(0, 2);

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        recommendedProducts: matchedProds.length > 0 ? matchedProds : null,
        actionLinks: actionLinks.length > 0 ? actionLinks : null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallback = getStylistResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: fallback.text,
          actionLinks: fallback.actionLinks,
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

  // Helper to format markdown text with bolding, line breaks, and clickable markdown links
  const renderFormattedText = (txt) => {
    if (!txt) return null;

    // Split text by markdown links [label](path) and bold **text**
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(txt)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: txt.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'link', label: match[1], url: match[2] });
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < txt.length) {
      parts.push({ type: 'text', content: txt.slice(lastIndex) });
    }

    return parts.map((chunk, idx) => {
      if (chunk.type === 'link') {
        const isExternal = chunk.url.startsWith('http') || chunk.url.startsWith('tel:');
        if (isExternal) {
          return (
            <a
              key={idx}
              href={chunk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/80 px-2 py-0.5 rounded-lg border border-amber-500/40 text-[11px] my-0.5 mx-0.5 shadow-2xs transition-all"
            >
              <span>{chunk.label}</span>
              <ExternalLink size={10} />
            </a>
          );
        }
        return (
          <button
            key={idx}
            onClick={() => handleNavigate(chunk.url)}
            className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white bg-[#520C17]/80 hover:bg-[#700B1A] px-2.5 py-0.5 rounded-lg border border-[#E8A87C]/50 text-[11px] my-0.5 mx-0.5 shadow-2xs transition-all cursor-pointer group"
          >
            <span>{chunk.label}</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform text-[#E8A87C]" />
          </button>
        );
      }

      // Format bold text within text chunk
      const boldParts = chunk.content.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${idx}-${bIdx}`} className="text-amber-200 font-bold">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${idx}-${bIdx}`}>{bPart}</span>;
      });
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 select-none">
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#1C1917]/95 text-amber-200 text-xs font-bold px-3.5 py-2 rounded-full shadow-2xl border border-amber-400/40 cursor-pointer hover:border-amber-400 transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <Sparkles size={14} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Chat with Stylist Laxmi</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#5A0C16] via-[#7A1224] to-[#C97A44] text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center border-2 border-amber-400/70 group cursor-pointer"
            aria-label="Open Showroom Saree Stylist"
            title="Chat with Showroom Stylist Laxmi"
          >
            <Sparkles size={24} className="text-amber-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></span>
          </button>
        </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[590px] max-h-[85vh] bg-[#141211] text-gray-100 rounded-3xl border border-[#3E3834] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="h-16 px-4 bg-gradient-to-r from-[#4A0E17] via-[#5C161D] to-[#1C1917] border-b border-amber-500/30 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E8A87C] to-[#4A0E17] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#1A0A0E] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img
                    src={logoImg}
                    alt="Sri Vijay Laxmi"
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1A0A0E]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                    Laxmi • Senior Saree Stylist
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Showroom Desk
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/80">
                  Sri Vijaylaxmi Textiles • Rikab Gunj, Hyderabad
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
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-[#700B1A] to-[#9F1239] text-white rounded-tr-xs'
                        : 'bg-[#1C1917] text-gray-200 border border-[#2E2824] rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>

                    {/* Quick Action Navigation Pills */}
                    {msg.actionLinks && msg.actionLinks.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#332E29] flex flex-wrap gap-1.5">
                        {msg.actionLinks.map((action, aIdx) =>
                          action.isExternal ? (
                            <a
                              key={aIdx}
                              href={action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#064E3B]/80 hover:bg-[#065F46] text-emerald-200 border border-emerald-500/40 text-[10.5px] font-bold shadow-xs hover:scale-[1.02] transition-all"
                            >
                              <span>{action.label}</span>
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <button
                              key={aIdx}
                              onClick={() => handleNavigate(action.path)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#5A0C16] to-[#7A1224] hover:from-[#700B1A] hover:to-[#9F1239] text-[#FDE68A] hover:text-white border border-[#E8A87C]/40 text-[10.5px] font-bold shadow-xs hover:scale-[1.02] transition-all cursor-pointer group"
                            >
                              <span>{action.label}</span>
                              <ArrowRight size={11} className="text-[#E8A87C] group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          )
                        )}
                      </div>
                    )}

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
                              onClick={() => {
                                if (window.innerWidth < 640) setIsOpen(false);
                              }}
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

                    <span className="block text-[9px] text-gray-500 mt-1.5 text-right">
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
                  <span className="text-[11px] text-gray-400 ml-1">Laxmi is guiding...</span>
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
                className="px-2.5 py-1 rounded-full bg-[#262220] hover:bg-[#332D29] border border-[#3E3834] hover:border-amber-400/50 text-[10px] text-amber-200 whitespace-nowrap transition-all shrink-0 cursor-pointer"
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
              placeholder="Ask about sarees, order form, store location..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#262220] border border-[#3E3834] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#700B1A] to-[#D97706] hover:opacity-95 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              title="Send Message"
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
