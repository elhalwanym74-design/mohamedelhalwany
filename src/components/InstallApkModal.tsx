import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('لتثبيت التطبيق على هاتفك فوراً:\n1. اضغط على زر خيارات المتصفح (⋮) في أعلى كروم.\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".\nوسيتم تثبيته تلقائياً على جهازك!');
    }
  };

  const handleCopyAppUrl = () => {
    const url = window.location.href.split('#')[0];
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800">
          <img 
            src="/src/assets/images/app_icon_1794112547923.jpg" 
            alt="أيقونة كود كرافت" 
            className="w-14 h-14 rounded-2xl shadow-xl shadow-cyan-500/20 ring-2 ring-indigo-500/40 object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>تثبيت وتحميل كود كرافت على هاتفك</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                Android / APK
              </span>
            </h3>
            <p className="text-xs text-slate-400">تطبيق حقيقي يعمل بدون متصفح مع الأيقونة الرسمية</p>
          </div>
        </div>

        {/* Option 1: Direct WebAPK 1-Click Install on Android */}
        <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-700/60 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-1.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>الطريقة الأولى: التثبيت المباشر الفوري (WebAPK)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            يقوم نظام أندرويد تلقائياً بإنشاء حزمة <strong>APK رسمية</strong> وتثبيتها بين تطبيقات هاتفك. تفتح ملء الشاشة بدون شريط متصفح وتعمل بدون إنترنت!
          </p>

          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalled ? '✅ التطبيق مثبت بالفعل على جهازك' : '📲 تثبيت التطبيق على الهاتف الآن (فوري)'}</span>
          </button>

          <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>خطوات التثبيت اليدوي في ثوانٍ من متصفح هاتفك:</span>
            </div>
            <p>1. اضغط على زر القائمة <strong>(⋮ الثلاث نقاط)</strong> في أعلى متصفح Chrome.</p>
            <p>2. اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</p>
            <p>3. ستظهر أيقونة التطبيق في شاشة تطبيقات هاتفك مباشرة كأي ملف APK مثبت!</p>
          </div>
        </div>

        {/* Option 2: Build Independent Offline APK */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>الطريقة الثانية: تنزيل ملف APK مستقل عبر PWABuilder</span>
            </div>
            <span className="text-[10px] text-slate-400">للمشاركة وإرساله كملف</span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            إذا كنت تريد ملف خام بصيغة <code>.apk</code> لتثبيته يدوياً أو مشاركته مع أصدقائك عبر البلوتوث أو الواتساب، يمكنك استخدام أداة <strong>PWABuilder</strong> الرسمية (المدعومة من Google و Microsoft):
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAppUrl}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-xl font-medium border border-slate-700 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'تم نسخ رابط التطبيق' : 'نسخ رابط التطبيق'}</span>
            </button>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl font-bold transition-all shadow-md"
            >
              <span>فتح PWABuilder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
