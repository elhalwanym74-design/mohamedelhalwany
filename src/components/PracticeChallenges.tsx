import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle, 
  Lightbulb, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Code2, 
  Flame,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PracticeChallenge } from '../types';
import { PRACTICE_CHALLENGES } from '../data/challenges';

interface PracticeChallengesProps {
  onLoadChallenge: (challenge: PracticeChallenge) => void;
  onRunTest: (testCode: string, callback: (res: { pass: boolean; msg: string }) => void) => void;
  activeChallengeId: string | null;
  onBackToEditor: () => void;
}

export const PracticeChallenges: React.FC<PracticeChallengesProps> = ({
  onLoadChallenge,
  onRunTest,
  activeChallengeId,
  onBackToEditor
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<PracticeChallenge>(
    PRACTICE_CHALLENGES.find(c => c.id === activeChallengeId) || PRACTICE_CHALLENGES[0]
  );
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{ pass: boolean; msg: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleStartChallenge = (challenge: PracticeChallenge) => {
    setSelectedChallenge(challenge);
    setTestResult(null);
    onLoadChallenge(challenge);
  };

  const handleVerify = () => {
    setIsTesting(true);
    setTestResult(null);

    onRunTest(selectedChallenge.testCode, (result) => {
      setIsTesting(false);
      setTestResult(result);
      if (result.pass) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                تحديات وتمارين التدريب البرمجي
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              طبق مهاراتك البرمجية عبر حل تحديات حقيقية وفحص صحة الكود والنتائج بشكل فوري وتلقائي.
            </p>
          </div>

          <button
            onClick={onBackToEditor}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md self-start md:self-auto"
          >
            <Code2 className="w-4 h-4" />
            <span>الانتقال للمحرر وتطبيق الحل</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Challenge Selector & Active Workout Details */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Challenges */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            قائمة التمارين المتاحة ({PRACTICE_CHALLENGES.length})
          </h3>

          {PRACTICE_CHALLENGES.map((ch, idx) => {
            const isSelected = selectedChallenge.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChallenge(ch);
                  setTestResult(null);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                    تمرين #{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ch.level === 'مبتدئ' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ch.level}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {ch.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {ch.instructions}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Active Challenge Workspace */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Active Challenge Header */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2.5 py-1 rounded-md">
                  {selectedChallenge.category}
                </span>
                <span className="text-xs text-slate-400">
                  المستوى: <strong className="text-white">{selectedChallenge.level}</strong>
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {selectedChallenge.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedChallenge.instructions}
              </p>
            </div>

            {/* Requirements Checklist */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                شروط ومعايير إتمام التحدي:
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                {selectedChallenge.requirements.map((req, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints Accordion */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>تلميحات وإرشادات برمجية ({selectedChallenge.hints.length}):</span>
              </h4>
              <div className="space-y-2">
                {selectedChallenge.hints.map((hint, hIdx) => {
                  const isOpen = openHintIndex === hIdx;
                  return (
                    <div key={hIdx} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-xs">
                      <button
                        onClick={() => setOpenHintIndex(isOpen ? null : hIdx)}
                        className="w-full text-right p-2.5 flex items-center justify-between text-slate-300 hover:text-white"
                      >
                        <span className="font-semibold text-amber-300">تلميح رقم {hIdx + 1}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Result Banner */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs md:text-sm flex items-start gap-3 ${
                  testResult.pass
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-700 text-rose-200'
                }`}
              >
                {testResult.pass ? (
                  <Award className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <Flame className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <h5 className="font-bold text-sm mb-0.5">
                    {testResult.pass ? '🎉 نجاح باهر ومكتمل!' : '⚠️ الكود يحتاج لبعض التعديل'}
                  </h5>
                  <p>{testResult.msg}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800 mt-6">
            <button
              onClick={() => handleStartChallenge(selectedChallenge)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تحميل كود البداية في المحرر</span>
            </button>

            <button
              onClick={handleVerify}
              disabled={isTesting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTesting ? 'جاري الفحص...' : 'فحص والتحقق من الحل'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
