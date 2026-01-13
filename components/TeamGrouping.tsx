
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { LayoutGrid, Users, Sparkles, Wand2, Copy, Check, Hash, Download } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  participants: Participant[];
}

const TeamGrouping: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [numGroupsTarget, setNumGroupsTarget] = useState(2);
  const [mode, setMode] = useState<'size' | 'count'>('size');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  const generateGroups = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const shuffled: Participant[] = shuffleArray<Participant>(participants);
    let finalGroups: Group[] = [];

    if (mode === 'size') {
      const numGroups = Math.ceil(shuffled.length / groupSize);
      for (let i = 0; i < numGroups; i++) {
        const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
        finalGroups.push({
          id: `group-${i}`,
          name: `第 ${i + 1} 組`,
          members
        });
      }
    } else {
      const actualNumGroups = Math.min(numGroupsTarget, participants.length);
      finalGroups = Array.from({ length: actualNumGroups }, (_, i) => ({
        id: `group-${i}`,
        name: `第 ${i + 1} 組`,
        members: []
      }));

      shuffled.forEach((p, i) => {
        finalGroups[i % actualNumGroups].members.push(p);
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate ${finalGroups.length} creative, professional team names for a corporate event in Traditional Chinese. Return ONLY a comma-separated list. Theme: Technology, Energy and Collaboration.`,
      });
      
      const aiNames = response.text?.split(',').map(n => n.trim());
      if (aiNames && aiNames.length >= finalGroups.length) {
        finalGroups.forEach((g, i) => {
          g.name = aiNames[i];
        });
      }
    } catch (err) {
      console.warn("Using default team names.");
    }

    setGroups(finalGroups);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    const text = groups.map(g => {
      return `【${g.name}】\n${g.members.map(m => ` • ${m.name}`).join('\n')}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // 加入 BOM 確保 Excel 開啟不亂碼
    csvContent += "組別名稱,成員姓名\n";
    
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `分組名單_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="bg-indigo-100 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
               </div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">自動分組神器</h2>
            </div>
            <p className="text-slate-500 text-sm font-medium">智慧型成員分配，自動生成創意組名。</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               <button 
                 onClick={() => setMode('size')}
                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'size' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Users className="w-4 h-4" />
                 依每組人數
               </button>
               <button 
                 onClick={() => setMode('count')}
                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'count' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Hash className="w-4 h-4" />
                 依總組數
               </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200">
              <span className="text-sm font-black text-slate-600 uppercase tracking-widest">{mode === 'size' ? '每組幾人' : '共分幾組'}</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => mode === 'size' ? setGroupSize(Math.max(1, groupSize - 1)) : setNumGroupsTarget(Math.max(1, numGroupsTarget - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-xl font-bold transition-all shadow-sm"
                >
                  -
                </button>
                <span className="w-8 text-center text-xl font-black text-indigo-600">{mode === 'size' ? groupSize : numGroupsTarget}</span>
                <button 
                   onClick={() => mode === 'size' ? setGroupSize(Math.min(participants.length, groupSize + 1)) : setNumGroupsTarget(Math.min(participants.length, numGroupsTarget + 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-xl font-bold transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={generateGroups}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <Wand2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
              開始分組
            </button>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
               分組結果 <span className="bg-slate-200 text-slate-600 not-italic text-xs px-2 py-0.5 rounded-lg">共 {groups.length} 組</span>
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? '已複製!' : '複製文字'}
              </button>
              <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-sm font-bold text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                下載 CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {groups.map((group, idx) => (
              <div 
                key={group.id} 
                className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100 transition-all group overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="h-4 bg-indigo-500 w-full group-hover:bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6 gap-3">
                    <h4 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight">
                      {group.name}
                    </h4>
                    <span className="text-xs bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full font-black border border-indigo-100">
                      {group.members.length} 人
                    </span>
                  </div>
                  <div className="space-y-3 flex-1">
                    {group.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-sm transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {member.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && !isGenerating && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300 gap-6">
           <div className="bg-white p-10 rounded-full shadow-inner border border-slate-100">
              <LayoutGrid className="w-16 h-16 opacity-20" />
           </div>
           <div className="text-center">
             <p className="font-black text-xl text-slate-400 italic">準備好要分組了嗎？</p>
             <p className="text-sm font-medium mt-1">設定好條件後點擊「開始分組」即可查看結果。</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamGrouping;
