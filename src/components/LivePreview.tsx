import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  Maximize, 
  Minimize,
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Code2,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Expand
} from 'lucide-react';
import { ConsoleLog } from '../types';

interface LivePreviewProps {
  srcDoc: string;
  consoleLogs: ConsoleLog[];
  onClearLogs: () => void;
  onRefresh: () => void;
  onDownload: () => void;
  onCopyAllCode: () => void;
  onBackToEditor: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  srcDoc,
  consoleLogs,
  onClearLogs,
  onRefresh,
  onDownload,
  onCopyAllCode,
  onBackToEditor
}) => {
  // Immersive Mobile Mode: takes 100% of the phone screen, hiding all app chrome
  const [isImmersive, setIsImmersive] = useState(false);
  
  // Zoom scale percentage: 100%, 115%, 125%, 150% for easy phone viewing
  const [zoomScale, setZoomScale] = useState<number>(100);
  
  // Console drawer state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Quick zoom adjustments
  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 15, 175));
  };
  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 15, 75));
  };

  const handleCopy = () => {
    onCopyAllCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open standalone HTML in full separate browser tab
  const openInNewTab = () => {
    const blob = new Blob([srcDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Filter logs
  const filteredLogs = consoleLogs.filter(log => {
    if (consoleFilter === 'all') return true;
    if (consoleFilter === 'error') return log.type === 'error';
    if (consoleFilter === 'warn') return log.type === 'warn';
    if (consoleFilter === 'log') return log.type === 'log' || log.type === 'info';
    return true;
  });

  const errorCount = consoleLogs.filter(l => l.type === 'error').length;
  const warnCount = consoleLogs.filter(l => l.type === 'warn').length;

  return (
    <div 
      ref={containerRef} 
      className={`flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none ${
        isImmersive ? 'fixed inset-0 z-50 bg-white' : 'relative'
      }`}
    >
      {/* Immersive Floating Bar when Full Phone View is active */}
      {isImmersive ? (
        <div className="absolute top-2 left-2 right-2 z-50 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onBackToEditor}
              className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-full transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>المحرر</span>
            </button>
            <button
              onClick={onRefresh}
              title="تحديث المعاينة"
              className="p-1 text-slate-300 hover:text-white"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-700"></div>
            <button
              onClick={handleZoomIn}
              title="تكبير الحجم"
              className="p-1 text-slate-300 hover:text-white text-xs font-bold"
            >
              +
            </button>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">{zoomScale}%</span>
            <button
              onClick={handleZoomOut}
              title="تصغير الحجم"
              className="p-1 text-slate-300 hover:text-white text-xs font-bold"
            >
              -
            </button>
          </div>

          <button
            onClick={() => setIsImmersive(false)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-2xl flex items-center gap-1.5 pointer-events-auto hover:bg-slate-800 transition-colors"
          >
            <Minimize className="w-3.5 h-3.5" />
            <span>تصغير الشاشة</span>
          </button>
        </div>
      ) : (
        /* Regular Responsive Controls Bar */
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Mobile Enlargement High-Priority Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsImmersive(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 transition-all animate-pulse"
              title="تكبير المعاينة لتأخذ كامل شاشة الهاتف بنسبة 100%"
            >
              <Expand className="w-3.5 h-3.5" />
              <span>تكبير ملء شاشة الهاتف (100%)</span>
            </button>

            {/* Open in Separate Tab */}
            <button
              onClick={openInNewTab}
              title="فتح في نافذة متصفح مستقلة"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs border border-indigo-800/60"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Zoom Controls (Very useful on mobile!) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-1 font-medium hidden sm:inline">الحجم:</span>
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white font-bold"
              title="تصغير"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono text-cyan-400 font-bold px-1.5">
              {zoomScale}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white font-bold"
              title="تكبير"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Refresh */}
            <button
              onClick={onRefresh}
              title="إعادة تحميل المعاينة"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs border border-slate-700 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Copy Code */}
            <button
              onClick={handleCopy}
              title="نسخ الكود"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Download */}
            <button
              onClick={onDownload}
              title="تنزيل كملف HTML مستقل"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs border border-cyan-800/60 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Back to Editor */}
            <button
              onClick={onBackToEditor}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>المحرر</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Presentation Canvas: Pure 100% Full Edge-to-Edge Size */}
      <div 
        className="flex-1 w-full h-full p-0 m-0 overflow-auto bg-white relative flex flex-col"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="w-full h-full flex-1 flex flex-col bg-white overflow-auto relative"
          style={{
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined,
            transformOrigin: 'top right',
            width: zoomScale !== 100 ? `${100 / (zoomScale / 100)}%` : '100%',
            height: zoomScale !== 100 ? `${100 / (zoomScale / 100)}%` : '100%',
            minHeight: '100%'
          }}
        >
          {/* Real Live Sandboxed iFrame filling 100% of the screen */}
          <iframe
            id="main-preview-frame"
            title="CodeCraft Final Live Preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full flex-1 border-none block m-0 p-0"
            style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        </div>
      </div>

      {/* Compact Console Inspector Drawer (Only shown when not in immersive mode) */}
      {!isImmersive && (
        <div className="bg-slate-900 border-t border-slate-800 flex flex-col z-30 shrink-0">
          {/* Console Header Bar */}
          <div 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="px-3 py-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>الـ Console ({consoleLogs.length})</span>
              </div>

              {/* Error Badges */}
              {errorCount > 0 && (
                <span className="flex items-center gap-1 text-rose-400 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  <AlertCircle className="w-2.5 h-2.5" />
                  {errorCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isConsoleOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {/* Expandable Console Logs Body */}
          {isConsoleOpen && (
            <div className="h-44 bg-[#070a12] border-t border-slate-800 flex flex-col">
              {/* Filter controls */}
              <div className="px-3 py-1 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConsoleFilter('all'); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      consoleFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConsoleFilter('error'); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      consoleFilter === 'error' ? 'bg-rose-950 text-rose-300' : 'text-slate-400'
                    }`}
                  >
                    الأخطاء ({errorCount})
                  </button>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onClearLogs(); }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>مسح</span>
                </button>
              </div>

              {/* Logs List */}
              <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1" style={{ direction: 'ltr' }}>
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-600 text-center py-4 text-xs font-sans">
                    لا توجد رسائل أخطاء مسجلة.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-1.5 py-0.5 px-1.5 rounded text-[11px] ${
                        log.type === 'error'
                          ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500'
                          : log.type === 'warn'
                          ? 'bg-amber-950/30 text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="flex-1 whitespace-pre-wrap break-all">
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
