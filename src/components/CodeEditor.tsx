import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  Paintbrush, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Eraser, 
  Plus, 
  SplitSquareVertical, 
  Bookmark, 
  Maximize2,
  ListPlus,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { EditorTab } from '../types';

interface CodeEditorProps {
  html: string;
  css: string;
  js: string;
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;
  onHtmlChange: (val: string) => void;
  onCssChange: (val: string) => void;
  onJsChange: (val: string) => void;
  onRunPreview: () => void;
  onOpenVaultSave: () => void;
  onOpenFinalPreview: () => void;
  previewSrcDoc: string;
}

const SNIPPET_TEMPLATES = [
  {
    name: 'زر عصري بتأثير نابض (Pulse Button)',
    tab: 'html' as EditorTab,
    code: `<button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-xl group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-all active:scale-95 shadow-lg shadow-indigo-500/30">
  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-xl group-hover:bg-opacity-0">
    زر تفاعلي عصري ✨
  </span>
</button>`
  },
  {
    name: 'توسيط العناصر (Flexbox Center Container)',
    tab: 'css' as EditorTab,
    code: `.center-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  background: #090d16;
  color: #ffffff;
}`
  },
  {
    name: 'مربع حوار منبثق متجاوب (Modal Dialog)',
    tab: 'html' as EditorTab,
    code: `<div id="myModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
    <h3 class="text-lg font-bold mb-2">عنوان النافذة المنبثقة</h3>
    <p class="text-sm text-slate-400 mb-6">هذا النص هو محتوى تجريبي يمكن تخصيصه لأي استخدام تفاعلي ترغب به.</p>
    <div class="flex justify-end gap-3">
      <button onclick="document.getElementById('myModal').style.display='none'" class="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">إغلاق</button>
      <button class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">تأكيد الإجراء</button>
    </div>
  </div>
</div>`
  },
  {
    name: 'جلب بيانات من واجهة برمجة (Fetch API Template)',
    tab: 'js' as EditorTab,
    code: `async function fetchSampleData() {
  try {
    console.log("جاري طلب البيانات...");
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data = await res.json();
    console.log("تم استلام البيانات بنجاح:", data);
  } catch (err) {
    console.error("حدث خطأ أثناء الجلب:", err.message);
  }
}

fetchSampleData();`
  },
  {
    name: 'تأثير زجاجي حديث (Modern Glassmorphism CSS)',
    tab: 'css' as EditorTab,
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`
  }
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  html,
  css,
  js,
  activeTab,
  setActiveTab,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onRunPreview,
  onOpenVaultSave,
  onOpenFinalPreview,
  previewSrcDoc
}) => {
  const [copied, setCopied] = useState(false);
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Active code based on tab
  const activeCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const setCode = (val: string) => {
    if (activeTab === 'html') onHtmlChange(val);
    else if (activeTab === 'css') onCssChange(val);
    else onJsChange(val);
  };

  // Sync scroll between textarea and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Support Tab key indentation in textarea (2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;

      // Insert 2 spaces
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCode(newValue);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Format code (clean extra spaces and empty lines)
  const formatCode = () => {
    const lines = activeCode.split('\n').map(l => l.trimEnd());
    setCode(lines.join('\n').trim());
  };

  // Copy code to clipboard
  const copyCurrentCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear current tab
  const clearCurrentTab = () => {
    if (window.confirm('هل تريد مسح كود هذه الصفحة؟')) {
      setCode('');
    }
  };

  // Insert snippet at cursor or append
  const insertSnippet = (snippetCode: string, targetTab: EditorTab) => {
    setActiveTab(targetTab);
    setTimeout(() => {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const current = targetTab === 'html' ? html : targetTab === 'css' ? css : js;
        const updated = current.substring(0, start) + '\n' + snippetCode + '\n' + current.substring(end);
        if (targetTab === 'html') onHtmlChange(updated);
        else if (targetTab === 'css') onCssChange(updated);
        else onJsChange(updated);
      } else {
        if (targetTab === 'html') onHtmlChange(html + '\n\n' + snippetCode);
        else if (targetTab === 'css') onCssChange(css + '\n\n' + snippetCode);
        else onJsChange(js + '\n\n' + snippetCode);
      }
      setShowSnippetsMenu(false);
      onRunPreview();
    }, 50);
  };

  // Line numbers calculation
  const linesCount = Math.max(1, activeCode.split('\n').length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Editor Tabs (HTML / CSS / JS) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
              activeTab === 'html'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>HTML</span>
            <span className="text-[10px] opacity-70 bg-black/30 px-1 rounded">
              {html.split('\n').length}L
            </span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
              activeTab === 'css'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>CSS</span>
            <span className="text-[10px] opacity-70 bg-black/30 px-1 rounded">
              {css.split('\n').length}L
            </span>
          </button>

          <button
            onClick={() => setActiveTab('js')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
              activeTab === 'js'
                ? 'bg-yellow-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>JavaScript</span>
            <span className="text-[10px] opacity-70 bg-black/30 px-1 rounded">
              {js.split('\n').length}L
            </span>
          </button>
        </div>

        {/* Toolbar Center / Quick Snippets Injector */}
        <div className="relative">
          <button
            onClick={() => setShowSnippetsMenu(!showSnippetsMenu)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>إدراج كود جاهز (Snippets)</span>
          </button>

          {showSnippetsMenu && (
            <div className="absolute top-full mt-2 right-0 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                مكتبة القصاصات والأكواد الجاهزة
              </div>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {SNIPPET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertSnippet(tmpl.code, tmpl.tab)}
                    className="w-full text-right px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-200 flex items-center justify-between gap-2 group transition-colors"
                  >
                    <span className="truncate">{tmpl.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 group-hover:bg-slate-700 text-cyan-400 uppercase">
                      {tmpl.tab}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Format */}
          <button
            onClick={formatCode}
            title="تنسيق الكود وتنظيف المسافات"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg text-xs transition-colors"
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">تنسيق</span>
          </button>

          {/* Copy */}
          <button
            onClick={copyCurrentCode}
            title="نسخ كود التبويب الحالي"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          {/* Clear */}
          <button
            onClick={clearCurrentTab}
            title="مسح محتوى هذا التبويب"
            className="text-slate-400 hover:text-rose-400 hover:bg-slate-800 p-1.5 rounded-lg text-xs transition-colors"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Toggle Split Preview side-by-side */}
          <button
            onClick={() => setShowSplitView(!showSplitView)}
            title="معاينة منقسمة سريعة بجانب المحرر"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showSplitView 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden md:inline">معاينة جانبية</span>
          </button>

          {/* Save to Vault */}
          <button
            onClick={onOpenVaultSave}
            title="حفظ هذا المشروع في مخزن الأكواد"
            className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>حفظ بالمخزن</span>
          </button>

          {/* Run Preview CTA */}
          <button
            onClick={() => {
              onRunPreview();
              onOpenFinalPreview();
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>المعاينة النهائية</span>
          </button>
        </div>
      </div>

      {/* Main Body: Code Editor (Full or Split) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Input Area with accurate Line Numbers */}
        <div className={`flex-1 flex flex-col bg-[#0b0f19] relative transition-all ${showSplitView ? 'w-1/2' : 'w-full'}`}>
          <div className="flex-1 flex overflow-hidden relative">
            {/* Line numbers gutter */}
            <div
              ref={lineNumbersRef}
              className="w-12 bg-[#080b12] text-slate-600 font-mono text-xs select-none py-3 pr-2 text-right overflow-hidden border-l border-slate-900 border-r border-slate-900/50"
              style={{ direction: 'ltr' }}
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 h-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              value={activeCode}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              className="flex-1 w-full bg-transparent text-slate-100 font-mono text-xs md:text-sm p-3 leading-6 outline-none resize-none code-font selection:bg-indigo-600 selection:text-white"
              style={{
                direction: 'ltr',
                tabSize: 2,
                whiteSpace: 'pre'
              }}
              placeholder={`اكتب كود الـ ${activeTab.toUpperCase()} هنا بكل حرية...`}
            />
          </div>

          {/* Editor Status Bar */}
          <div className="bg-[#080c14] border-t border-slate-900 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-semibold uppercase">{activeTab}</span>
              <span>·</span>
              <span>{linesCount} أسطر</span>
              <span>·</span>
              <span>{activeCode.length} حرف</span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>·</span>
              <span>مسافة البادئة: 2 spaces</span>
            </div>
          </div>
        </div>

        {/* Optional Split-Screen Live Preview */}
        {showSplitView && (
          <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-900 relative">
            <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>معاينة حية فورية</span>
              </div>
              <button
                onClick={onOpenFinalPreview}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>شاشة كاملة</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                title="Split Live Preview"
                srcDoc={previewSrcDoc}
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
