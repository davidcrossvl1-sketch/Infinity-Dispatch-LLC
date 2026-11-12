import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { ChatMessage } from '../types';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Shield,
  Lock,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Sparkles,
  Phone,
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [carrierPhone, setCarrierPhone] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Owner Mode in Live Chat
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerLoginError, setOwnerLoginError] = useState('');
  const [activeOwner, setActiveOwner] = useState<'David Cross' | 'Alvin'>('David Cross');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages(storage.getChatMessages());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle Carrier Message
  const handleSendCarrierMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'carrier',
      senderName: carrierName.trim() || 'Carrier / Driver',
      carrierName: carrierName.trim() || undefined,
      carrierContact: carrierPhone.trim() || undefined,
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent',
    };

    storage.saveChatMessage(newMsg);
    setMessages(storage.getChatMessages());

    // Also notify owners via email notification record
    storage.logEmail({
      to: 'Davidcross.vl1@gmail.com',
      subject: `New Live Chat Message from ${carrierName || 'Carrier'} (${carrierPhone || 'No Phone'})`,
      body: userMsgText,
      type: 'Live Inquiry',
    });

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText }),
      });

      if (response.ok) {
        const data = await response.json();
        const geminiReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'gemini',
          senderName: 'David AI Assistant',
          text: data.reply || "David Cross (+1 409-509-6940) and Alvin have received your message and will follow up shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Replied',
        };
        storage.saveChatMessage(geminiReply);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Offline / Intelligent Trucking Fallback
      const fallbackReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'gemini',
        senderName: 'David AI Assistant',
        text: "Thank you for reaching out! David Cross (+1 409-509-6940, Telegram @DavidCross4899) and Alvin are actively monitoring all carrier check calls and lane requests. Submit your carrier info on our Carrier Sign-Up section and we will get your truck rolling!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Replied',
      };
      storage.saveChatMessage(fallbackReply);
    } finally {
      setIsTyping(false);
      setMessages(storage.getChatMessages());
    }
  };

  // Handle Owner Direct Reply
  const handleSendOwnerReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const ownerMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: activeOwner,
      senderName: `${activeOwner} (Owner / Executive)`,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Replied',
    };

    setInputText('');
    storage.saveChatMessage(ownerMsg);
    setMessages(storage.getChatMessages());
  };

  // Handle Owner Login into Live Desk
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerPassword.trim() === 'Malik@786') {
      setIsOwnerMode(true);
      setShowOwnerLogin(false);
      setOwnerPassword('');
      setOwnerLoginError('');
      storage.markChatMessagesSeen();
      setMessages(storage.getChatMessages());
    } else {
      setOwnerLoginError('Invalid master password. Access denied.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Compact Box Button (Small box icon button as requested) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white shadow-xl shadow-blue-600/40 border border-sky-300/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          title="Open Live Dispatch AI Chat (David & Alvin)"
          aria-label="Open Live Dispatch AI Chat"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#091122]" />
            </span>
          </div>

          {/* Clean small hover tooltip */}
          <div className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-blue-800 text-[11px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
            Live Dispatch AI · Online
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[550px] max-h-[85vh] rounded-3xl bg-[#091122] border border-blue-500/50 shadow-[0_20px_60px_rgba(0,10,30,0.85)] flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0C1834] via-[#0D1E42] to-[#0A142C] border-b border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-sky-300">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#091122]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">David AI Dispatch Desk</h3>
                  {isOwnerMode && (
                    <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                      OWNER DESK
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 font-mono">
                  {isOwnerMode ? `Logged in: ${activeOwner}` : '24/7 Rates & Carrier Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Owner Login Key Button */}
              <button
                onClick={() => {
                  if (isOwnerMode) {
                    setIsOwnerMode(false);
                  } else {
                    setShowOwnerLogin(!showOwnerLogin);
                  }
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  isOwnerMode
                    ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isOwnerMode ? 'Switch to Carrier Mode' : 'Owner Desk Login'}
              >
                <Shield className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Owner Desk Quick Auth Banner (if toggled) */}
          {showOwnerLogin && !isOwnerMode && (
            <div className="p-3 bg-[#060D1A] border-b border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Desk Master Authentication</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Strict Auth</span>
              </div>

              <form onSubmit={handleOwnerLogin} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveOwner('David Cross')}
                    className={`py-1 text-[11px] rounded font-bold cursor-pointer ${
                      activeOwner === 'David Cross'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    David Cross
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveOwner('Alvin')}
                    className={`py-1 text-[11px] rounded font-bold cursor-pointer ${
                      activeOwner === 'Alvin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Alvin
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter owner master password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Login
                  </button>
                </div>

                {ownerLoginError && (
                  <span className="text-[11px] text-rose-400 block">{ownerLoginError}</span>
                )}
              </form>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#070D1A]/95 text-xs">
            {messages.map((msg) => {
              const isCarrier = msg.sender === 'carrier';
              const isOwner = msg.sender === 'David Cross' || msg.sender === 'Alvin';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCarrier ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                    {msg.status && (
                      <span
                        className={`px-1 rounded text-[9px] font-bold ${
                          msg.status === 'Sent'
                            ? 'bg-blue-950 text-sky-400 border border-blue-800'
                            : msg.status === 'Seen'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {msg.status}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isCarrier
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : isOwner
                        ? 'bg-gradient-to-r from-amber-950/80 to-blue-950/80 border border-amber-500/40 text-amber-100 rounded-tl-none font-medium'
                        : 'bg-[#0E1A33] border border-blue-900/50 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono italic">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>David AI analyzing freight response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Carrier Info Bar (Optional for first-time carriers) */}
          {!isOwnerMode && messages.length <= 2 && (
            <div className="px-3 py-1.5 bg-[#091224] border-t border-blue-900/40 grid grid-cols-2 gap-2 text-[11px]">
              <input
                type="text"
                placeholder="Your Name / MC#"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white"
              />
              <input
                type="text"
                placeholder="Phone (Optional)"
                value={carrierPhone}
                onChange={(e) => setCarrierPhone(e.target.value)}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white"
              />
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={isOwnerMode ? handleSendOwnerReply : handleSendCarrierMessage}
            className="p-3 bg-[#0A1428] border-t border-blue-900/50 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isOwnerMode
                  ? `Reply directly as ${activeOwner}...`
                  : 'Ask about freight rates, lane setups, commission...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className={`p-2.5 rounded-xl text-white shadow-md transition-all cursor-pointer ${
                isOwnerMode
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
