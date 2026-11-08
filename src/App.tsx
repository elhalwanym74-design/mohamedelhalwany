import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { CodeVault } from './components/CodeVault';
import { PracticeChallenges } from './components/PracticeChallenges';
import { SaveToVaultModal } from './components/SaveToVaultModal';
import { BrotherAssistant } from './components/BrotherAssistant';
import { InstallApkModal } from './components/InstallApkModal';
import { VaultItem, EditorTab, ConsoleLog, PracticeChallenge } from './types';
import { DEFAULT_VAULT_ITEMS } from './data/defaultVault';
import { generatePreviewHtml, downloadHtmlFile } from './utils/codeRunner';
import { Sparkles } from 'lucide-react';

const VAULT_STORAGE_KEY = 'codecraft_vault_v1';
const CURRENT_CODE_KEY = 'codecraft_current_code_v1';

export default function App() {
  // Navigation State: 'editor' | 'preview' | 'vault' | 'challenges'
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'vault' | 'challenges'>('editor');
  
  // Editor State
  const [activeTab, setActiveTab] = useState<EditorTab>('html');

  // Initial code load from localStorage or default
  const [html, setHtml] = useState<string>(() => {
    const saved = localStorage.getItem(CURRENT_CODE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.html !== undefined) return parsed.html;
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_VAULT_ITEMS[0].html;
  });

  const [css, setCss] = useState<string>(() => {
    const saved = localStorage.getItem(CURRENT_CODE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.css !== undefined) return parsed.css;
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_VAULT_ITEMS[0].css;
  });

  const [js, setJs] = useState<string>(() => {
    const saved = localStorage.getItem(CURRENT_CODE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.js !== undefined) return parsed.js;
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_VAULT_ITEMS[0].js;
  });

  // Vault Items State
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem(VAULT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse stored vault items", e);
      }
    }
    return DEFAULT_VAULT_ITEMS;
  });

  // Console Logs
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  // Generated Sandboxed HTML for Preview
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Active Challenge ID if any
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  // Brother AI Assistant Open State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Install APK Modal Open State
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Challenge test callback reference
  const challengeCallbackRef = useRef<((res: { pass: boolean; msg: string }) => void) | null>(null);

  // Auto-save current code to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_CODE_KEY, JSON.stringify({ html, css, js }));
    } catch (e) {
      // ignore
    }
  }, [html, css, js]);

  // Auto-save vault items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vaultItems));
    } catch (e) {
      console.error("Failed to save vault items", e);
    }
  }, [vaultItems]);

  // Update preview srcDoc
  const refreshPreview = () => {
    const compiled = generatePreviewHtml({ html, css, js });
    setPreviewSrcDoc(compiled);
  };

  // Compile preview on mount and when code changes
  useEffect(() => {
    refreshPreview();
  }, [html, css, js]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Listen for iframe postMessage (Console logs & Challenge Test Results)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === 'CODECRAFT_CONSOLE') {
        const newLog: ConsoleLog = {
          id: `${Date.now()}-${Math.random()}`,
          type: e.data.logType || 'log',
          text: e.data.text || '',
          timestamp: e.data.timestamp || new Date().toLocaleTimeString('ar-EG')
        };
        setConsoleLogs((prev) => [newLog, ...prev.slice(0, 100)]);
      }

      if (e.data.type === 'CHALLENGE_TEST_RESULT' && challengeCallbackRef.current) {
        challengeCallbackRef.current(e.data.result);
        challengeCallbackRef.current = null;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handlers for Vault operations
  const handleLoadItemToEditor = (item: VaultItem) => {
    setHtml(item.html);
    setCss(item.css);
    setJs(item.js);
    refreshPreview();
    setActiveView('editor');
    showToast(`تم تحميل "${item.title}" في المحرر بنجاح!`);
  };

  const handlePreviewItem = (item: VaultItem) => {
    setHtml(item.html);
    setCss(item.css);
    setJs(item.js);
    refreshPreview();
    setActiveView('preview');
  };

  const handleDeleteVaultItem = (id: string) => {
    const item = vaultItems.find(i => i.id === id);
    if (window.confirm(`هل أنت متأكد من حذف "${item?.title || 'هذا الكود'}" من المخزن؟`)) {
      setVaultItems(prev => prev.filter(i => i.id !== id));
      showToast('تم حذف الكود من المخزن');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setVaultItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isFavorite;
        showToast(nextState ? 'تمت الإضافة للمفضلة ⭐' : 'تمت الإزالة من المفضلة');
        return { ...item, isFavorite: nextState };
      }
      return item;
    }));
  };

  const handleSaveNewVaultItem = (data: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: VaultItem = {
      ...data,
      id: `vault-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setVaultItems(prev => [newItem, ...prev]);
    showToast(`تم حفظ "${newItem.title}" في المخزن بنجاح!`);
  };

  const handleSaveCurrentCodeToVault = (data: {
    title: string;
    description: string;
    category: any;
    tags: string[];
    isFavorite: boolean;
  }) => {
    handleSaveNewVaultItem({
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      html,
      css,
      js,
      isFavorite: data.isFavorite
    });
  };

  const handleUpdateVaultItem = (updated: VaultItem) => {
    setVaultItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    showToast('تم حفظ التعديلات بنجاح');
  };

  // Export Vault to JSON
  const handleExportVault = () => {
    const dataStr = JSON.stringify(vaultItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecraft-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف النسخة الاحتياطية بنجاح!');
  };

  // Import Vault from JSON
  const handleImportVault = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          // Merge avoiding ID collisions
          const existingIds = new Set(vaultItems.map(i => i.id));
          const newItems: VaultItem[] = parsed.map((item: any) => ({
            id: existingIds.has(item.id) ? `vault-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` : item.id,
            title: item.title || 'كود مستورد',
            description: item.description || '',
            category: item.category || 'ui-components',
            tags: Array.isArray(item.tags) ? item.tags : ['مستورد'],
            html: item.html || '',
            css: item.css || '',
            js: item.js || '',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: !!item.isFavorite
          }));

          setVaultItems(prev => [...newItems, ...prev]);
          showToast(`تم استيراد ${newItems.length} كود بنجاح إلى مخزنك!`);
        } else {
          alert('ملف JSON غير صالح كنسخة احتياطية لكود كرافت.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Download Current Code
  const handleDownloadCode = () => {
    downloadHtmlFile(html, css, js, 'codecraft-project.html');
    showToast('تم تحميل كود المشروع كملف HTML مستقل!');
  };

  // Reset Editor to clean starter
  const handleResetCode = () => {
    if (window.confirm('هل تريد إعادة تعيين المحرر إلى القالب الأولي؟')) {
      const initial = DEFAULT_VAULT_ITEMS[0];
      setHtml(initial.html);
      setCss(initial.css);
      setJs(initial.js);
      setConsoleLogs([]);
      refreshPreview();
      showToast('تمت إعادة ضبط المحرر');
    }
  };

  // Copy full code
  const handleCopyAllCode = () => {
    const full = generatePreviewHtml({ html, css, js });
    navigator.clipboard.writeText(full);
    showToast('تم نسخ الكود المكتمل بالكامل!');
  };

  // Challenge test runner
  const handleRunChallengeTest = (testCode: string, callback: (res: { pass: boolean; msg: string }) => void) => {
    challengeCallbackRef.current = callback;
    const iframe = document.getElementById('main-preview-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'RUN_CHALLENGE_TEST',
        testCode: testCode
      }, '*');
    } else {
      callback({ pass: false, msg: 'يرجى فتح صفحة المعاينة أولاً لتشغيل الفحص' });
    }
  };

  const handleLoadChallenge = (challenge: PracticeChallenge) => {
    setActiveChallengeId(challenge.id);
    setHtml(challenge.starterHtml);
    setCss(challenge.starterCss);
    setJs(challenge.starterJs);
    refreshPreview();
    setActiveView('editor');
    showToast(`تم تحميل كود "${challenge.title}" في المحرر!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        vaultCount={vaultItems.length}
        onRunPreview={refreshPreview}
        onSaveToVault={() => setIsSaveModalOpen(true)}
        onResetCode={handleResetCode}
        onDownloadCode={handleDownloadCode}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main View Display */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Page 1: Code Editor & Builder */}
        {activeView === 'editor' && (
          <CodeEditor
            html={html}
            css={css}
            js={js}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onHtmlChange={setHtml}
            onCssChange={setCss}
            onJsChange={setJs}
            onRunPreview={refreshPreview}
            onOpenVaultSave={() => setIsSaveModalOpen(true)}
            onOpenFinalPreview={() => {
              refreshPreview();
              setActiveView('preview');
            }}
            previewSrcDoc={previewSrcDoc}
          />
        )}

        {/* Page 2: Final Live Preview */}
        {activeView === 'preview' && (
          <LivePreview
            srcDoc={previewSrcDoc}
            consoleLogs={consoleLogs}
            onClearLogs={() => setConsoleLogs([])}
            onRefresh={refreshPreview}
            onDownload={handleDownloadCode}
            onCopyAllCode={handleCopyAllCode}
            onBackToEditor={() => setActiveView('editor')}
          />
        )}

        {/* Page 3: Code Vault (مخزن الأكواد المهمة) */}
        {activeView === 'vault' && (
          <CodeVault
            vaultItems={vaultItems}
            onLoadItemToEditor={handleLoadItemToEditor}
            onPreviewItem={handlePreviewItem}
            onDeleteItem={handleDeleteVaultItem}
            onToggleFavorite={handleToggleFavorite}
            onSaveNewItem={handleSaveNewVaultItem}
            onUpdateItem={handleUpdateVaultItem}
            onExportVault={handleExportVault}
            onImportVault={handleImportVault}
          />
        )}

        {/* Page 4: Practical Coding Challenges */}
        {activeView === 'challenges' && (
          <PracticeChallenges
            onLoadChallenge={handleLoadChallenge}
            onRunTest={handleRunChallengeTest}
            activeChallengeId={activeChallengeId}
            onBackToEditor={() => setActiveView('editor')}
          />
        )}
      </main>

      {/* Floating Assistant Trigger for Phone & Quick Access */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-indigo-600/50 flex items-center gap-2 border border-indigo-400/50 hover:scale-105 active:scale-95 transition-all"
          title="محادثة «أخـي» المساعد البرمجي"
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-bold">اسأل «أخـي»</span>
        </button>
      )}

      {/* Brother AI Assistant Component */}
      <BrotherAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentCode={{ html, css, js }}
        consoleErrors={consoleLogs.filter(l => l.type === 'error')}
        onApplyCode={(code) => {
          if (code.html !== undefined) setHtml(code.html);
          if (code.css !== undefined) setCss(code.css);
          if (code.js !== undefined) setJs(code.js);
          refreshPreview();
          setActiveView('editor');
          showToast(`تم تطبيق كود ${code.title || 'أخـي'} في المحرر بنجاح!`);
        }}
        onSaveToVault={(item) => {
          handleSaveNewVaultItem({
            title: item.title,
            description: 'كود تم إنشاؤه وتطويره بواسطة أخـي المساعد البرمجي',
            category: item.category || 'interactive-apps',
            tags: ['مساعد-أخي', 'ذكاء-اصطناعي', 'تفاعلي'],
            html: item.html,
            css: item.css,
            js: item.js,
            isFavorite: true
          });
        }}
      />

      {/* Modal for Saving Current Code to Vault */}
      <SaveToVaultModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveCurrentCodeToVault}
      />

      {/* Modal for Installing and Generating APK on Android */}
      <InstallApkModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
