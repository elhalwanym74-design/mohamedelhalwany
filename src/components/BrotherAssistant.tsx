import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Code2, 
  Bookmark, 
  Play, 
  RotateCw, 
  AlertCircle, 
  Check, 
  Bot, 
  User, 
  HelpCircle,
  Wand2
} from 'lucide-react';

interface BrotherAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: { html: string; css: string; js: string };
  consoleErrors: any[];
  onApplyCode: (code: { html: string; css: string; js: string; title?: string }) => void;
  onSaveToVault: (item: { title: string; html: string; css: string; js: string; category?: any }) => void;
}

interface ChatMessage {
  id: string;
  sender: 'brother' | 'user';
  text: string;
  timestamp: string;
  extractedCode?: {
    title?: string;
    html: string;
    css: string;
    js: string;
  };
}

export const BrotherAssistant: React.FC<BrotherAssistantProps> = ({
  isOpen,
  onClose,
  currentCode,
  consoleErrors,
  onApplyCode,
  onSaveToVault
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'brother',
      text: 'أهلاً بك يا أخي الحبيب! أنا مساعدك البرمجي «أخـي». اطلب مني أي شيء تريده: برمجة فكرة جديدة، تصميم واجهة متجاوبة لهاتفك، أو فحص وتصحيح الكود الحالي لديك.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentCode,
          consoleErrors
        })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const brotherMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'brother',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        extractedCode: data.extractedCode || undefined
      };

      setMessages(prev => [...prev, brotherMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'brother',
          text: `عذراً يا أخي، حدث خطأ أثناء الاتصال: ${err.message || 'يرجى المحاولة مجدداً'}.`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (msgId: string, code: any) => {
    onApplyCode(code);
    setAppliedId(msgId);
    setTimeout(() => setAppliedId(null), 3000);
  };

  const QUICK_PROMPTS = [
    '🔧 افحص الكود الحالي وأصلح أي خطأ',
    '📱 صمم لي بطاقة ملف شخصي متجاوبة مع الهاتف',
    '🎮 أنشئ لي لعبة تفاعلية بسيطة (X-O)',
    '⏱️ أنشئ مؤقت عد تنازلي مع صوت تنبيه'
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-slate-900 border-r border-slate-800 z-50 flex flex-col shadow-2xl">
      {/* Assistant Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>أخـي المساعد البرمجي</span>
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.2 rounded-full">
                Gemini
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">رفيقك الذكي في كتابة وتطوير الأكواد</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs md:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
              {msg.sender === 'brother' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-slate-300">أخـي</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-300">أنت</span>
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                </>
              )}
              <span>· {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80 shadow-md'
              }`}
            >
              {msg.text}
            </div>

            {/* If Assistant generated actionable code */}
            {msg.extractedCode && (
              <div className="mt-2 w-[90%] bg-slate-950 border border-indigo-800/80 rounded-xl p-3 shadow-lg">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-xs text-white">
                      {msg.extractedCode.title || 'كود مقترح من أخي'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">جاهز للتطبيق</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApply(msg.id, msg.extractedCode)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-md"
                  >
                    {appliedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>تم التطبيق في المحرر!</span>
                      </>
                    ) : (
                      <>
                        <Code2 className="w-3.5 h-3.5" />
                        <span>تطبيق في المحرر فوراً</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSaveToVault({
                      title: msg.extractedCode?.title || 'كود من أخي المساعد',
                      html: msg.extractedCode?.html || '',
                      css: msg.extractedCode?.css || '',
                      js: msg.extractedCode?.js || ''
                    })}
                    title="حفظ في مخزن الأكواد"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs border border-slate-700"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 bg-slate-800/60 p-3 rounded-2xl w-fit">
            <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs">«أخـي» يفكر ويكتب لك الكود الآن...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اطلب أي كود أو فكرة من أخيك..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md"
            title="إرسال"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
