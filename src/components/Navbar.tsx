import React from 'react';
import { 
  Code2, 
  Play, 
  Archive, 
  Trophy, 
  Download, 
  RotateCcw, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  Bookmark
} from 'lucide-react';

interface NavbarProps {
  activeView: 'editor' | 'preview' | 'vault' | 'challenges';
  setActiveView: (view: 'editor' | 'preview' | 'vault' | 'challenges') => void;
  vaultCount: number;
  onRunPreview: () => void;
  onSaveToVault: () => void;
  onResetCode: () => void;
  onDownloadCode: () => void;
  onOpenAssistant: () => void;
  onOpenInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  vaultCount,
  onRunPreview,
  onSaveToVault,
  onResetCode,
  onDownloadCode,
  onOpenAssistant,
  onOpenInstallModal
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setActiveView('editor')}>
            <img 
              src="/src/assets/images/app_icon_1794112547923.jpg" 
              alt="كود كرافت" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/30 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                كود كرافت
                <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  Studio
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              محرر الأكواد · المعاينة المباشرة · مخزن الأكواد
            </p>
          </div>
        </div>

        {/* Primary Page Navigation Tabs (The 3 Main Sections + Challenges) */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveView('editor')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeView === 'editor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">محرر الأكواد</span>
            <span className="sm:hidden">المحرر</span>
          </button>

          <button
            onClick={() => {
              onRunPreview();
              setActiveView('preview');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeView === 'preview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            <span className="hidden sm:inline">المعاينة النهائية</span>
            <span className="sm:hidden">المعاينة</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveView('vault')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all relative ${
              activeView === 'vault'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">مخزن الأكواد</span>
            <span className="sm:hidden">المخزن</span>
            <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-1 py-0.2 rounded-full font-bold">
              {vaultCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('challenges')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeView === 'challenges'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline">التمارين</span>
          </button>
        </nav>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Install APK / App on Phone */}
          <button
            onClick={onOpenInstallModal}
            title="تثبيت وتحميل كود كرافت كـ APK على هاتفك"
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تحميل التطبيق</span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Summon Brother AI Assistant */}
          <button
            onClick={onOpenAssistant}
            title="استدعاء «أخي» المساعد البرمجي الذكي"
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs shadow-md shadow-indigo-600/30 transition-all border border-indigo-400/40 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>أخـي</span>
          </button>

          {/* Save to Vault CTA */}
          <button
            onClick={onSaveToVault}
            title="حفظ الكود الحالي في المخزن"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حفظ</span>
          </button>

          {/* Download full file */}
          <button
            onClick={onDownloadCode}
            title="تحميل كملف HTML مستقل"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 p-2 rounded-lg text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset button */}
          <button
            onClick={onResetCode}
            title="إعادة ضبط المحرر"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 p-2 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
