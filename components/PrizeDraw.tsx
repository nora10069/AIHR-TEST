
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Trophy, RefreshCw, Settings2, Play, CircleDot, History, Trash2, Sparkles } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const PrizeDraw: React.FC<Props> = ({ participants }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [availableList, setAvailableList] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<Participant[]>([]);
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailableList(participants);
    setWinner(null);
    setHistory([]);
  }, [participants]);

  const startDraw = () => {
    if (isRolling) return;
    
    const listToDrawFrom = allowRepeat ? participants : availableList;
    
    if (listToDrawFrom.length === 0) {
      alert("名單已抽完！請重新設定或開啟重複抽取。");
      return;
    }

    setIsRolling(true);
    setWinner(null);

    let startTime = Date.now();
    const duration = 2500;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const randomNames = Array.from({ length: 6 }, () => {
           return listToDrawFrom[Math.floor(Math.random() * listToDrawFrom.length)].name;
        });
        setDisplayNames(randomNames);
        timerRef.current = requestAnimationFrame(tick);
      } else {
        const finalWinner = listToDrawFrom[Math.floor(Math.random() * listToDrawFrom.length)];
        setWinner(finalWinner);
        setHistory(prev => [finalWinner, ...prev]);
        
        if (!allowRepeat) {
          setAvailableList(prev => prev.filter(p => p.id !== finalWinner.id));
        }
        
        setIsRolling(false);
        setDisplayNames([finalWinner.name]);
      }
    };

    timerRef.current = requestAnimationFrame(tick);
  };

  const resetDraw = () => {
    if (window.confirm("要重置抽籤進度嗎？這將清空歷史記錄並恢復所有參與者。")) {
      setAvailableList(participants);
      setHistory([]);
      setWinner(null);
      setDisplayNames([]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 flex justify-between items-center">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">幸運大抽籤</h2>
                <p className="text-indigo-100 text-sm font-medium">心跳加速的時刻到了！</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 bg-black/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="text-xs text-white font-bold uppercase tracking-widest">重複抽取</span>
                  <div 
                    onClick={() => !isRolling && setAllowRepeat(!allowRepeat)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${allowRepeat ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-white/20'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${allowRepeat ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
               </label>
            </div>
          </div>

          <div className="p-8 md:p-16 flex flex-col items-center justify-center min-h-[450px] relative bg-slate-50/50">
            <div className="w-full max-w-lg bg-white h-40 border-[6px] border-indigo-600 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.15)] flex items-center justify-center overflow-hidden relative">
              {isRolling ? (
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col gap-3 animate-slot">
                     {[...displayNames, ...displayNames].map((name, i) => (
                       <div key={i} className="h-24 flex items-center justify-center text-5xl font-black text-indigo-900 tracking-tighter uppercase italic">
                         {name}
                       </div>
                     ))}
                  </div>
                </div>
              ) : (
                <div className={`text-5xl font-black text-indigo-900 tracking-tighter text-center px-4 transition-all duration-700 ${winner ? 'scale-110 drop-shadow-xl' : 'opacity-20 italic'}`}>
                  {winner ? winner.name : '準備好了嗎？'}
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none z-10 opacity-60" />
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none z-10 opacity-60" />
            </div>

            <div className="mt-16 flex items-center gap-6">
              <button
                disabled={isRolling || (availableList.length === 0 && !allowRepeat)}
                onClick={startDraw}
                className="group relative px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50"
              >
                {isRolling ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-7 h-7 fill-current" />
                )}
                {isRolling ? '抽取中...' : '開始抽籤'}
              </button>

              <button
                onClick={resetDraw}
                disabled={isRolling}
                className="p-5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 rounded-2xl transition-all shadow-sm"
                title="重置"
              >
                <RefreshCw className="w-7 h-7" />
              </button>
            </div>

            {winner && !isRolling && (
              <div className="absolute top-10 pointer-events-none w-full flex justify-center">
                 <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                       <Sparkles key={i} className={`w-6 h-6 text-amber-400 animate-bounce delay-${i * 100}`} />
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="px-8 py-5 bg-white border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><CircleDot className="w-4 h-4 text-indigo-500" /> 總人數: {participants.length}</span>
                {!allowRepeat && <span className="flex items-center gap-2"><CircleDot className="w-4 h-4 text-amber-500" /> 剩餘: {availableList.length}</span>}
             </div>
             <div className="sm:hidden flex items-center gap-3">
               <span>重複抽取:</span>
               <button 
                 onClick={() => !isRolling && setAllowRepeat(!allowRepeat)}
                 className={`px-3 py-1 rounded-full text-white ${allowRepeat ? 'bg-emerald-500' : 'bg-slate-300'}`}
               >
                 {allowRepeat ? '開' : '關'}
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col h-full max-h-[650px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="bg-slate-100 p-2 rounded-lg">
              <History className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black">中獎名單</h3>
          </div>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-slate-400 hover:text-rose-500 transition-colors p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 py-20">
              <Trophy className="w-12 h-12" />
              <p className="font-bold uppercase tracking-widest text-[10px]">尚無中獎記錄</p>
            </div>
          ) : (
            history.map((h, i) => (
              <div 
                key={`${h.id}-${i}`} 
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in slide-in-from-right duration-500 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-indigo-500 shadow-sm">
                    {history.length - i}
                  </div>
                  <span className="font-bold text-slate-800">{h.name}</span>
                </div>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeDraw;
