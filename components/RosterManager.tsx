
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Upload, Plus, Trash2, FileText, UserPlus, Users, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const RosterManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // 偵測重複的姓名
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => counts.set(p.name, (counts.get(p.name) || 0) + 1));
    return new Set(Array.from(counts.entries()).filter(([_, count]) => count > 1).map(([name]) => name));
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[\r\n,]+/)
        .map(n => n.trim())
        .filter(n => n.length > 0 && n.toLowerCase() !== 'name');

      const newParticipants: Participant[] = names.map(name => ({
        id: Math.random().toString(36).substring(2, 9),
        name
      }));
      
      onUpdate([...participants, ...newParticipants]);
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    
    const names = inputText.split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substring(2, 9),
      name
    }));

    onUpdate([...participants, ...newParticipants]);
    setInputText('');
  };

  const loadSampleData = () => {
    const samples = ['陳小明', '林美玲', '王大同', '張雅婷', '李家豪', '郭靜宜', '林家佑', '周思潔', '黃志豪', '張淑芬', '王小華', '陳雅筑', '蔡志豪', '許淑惠', '陳小明', '王大同'];
    const sampleParticipants: Participant[] = samples.map(name => ({
      id: Math.random().toString(36).substring(2, 9),
      name
    }));
    onUpdate(sampleParticipants);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const removeItem = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900">匯入資料</h2>
            </div>
            <button 
              onClick={loadSampleData}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              載入模擬名單
            </button>
          </div>
          
          <div className="space-y-4">
            <label className="group flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-1" />
                <p className="text-sm text-slate-500 group-hover:text-indigo-600">上傳 CSV / TXT 檔案</p>
              </div>
              <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
            </label>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                placeholder="在此貼上姓名（每行一個，或用逗號分隔）..."
              />
              <button
                onClick={handleManualAdd}
                disabled={!inputText.trim()}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                新增至清單
              </button>
            </div>
          </div>
        </div>

        {duplicateNames.size > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-top-2">
            <div className="bg-rose-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">發現重複姓名！</h4>
              <p className="text-xs text-rose-700 mt-1">目前名單中有 {duplicateNames.size} 個姓名重複出現，這可能會影響抽籤或分組結果。</p>
              <button 
                onClick={removeDuplicates}
                className="mt-3 text-xs font-black text-white bg-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
              >
                一鍵移除重複姓名
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900">參與成員</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {participants.length}
            </span>
          </div>
          {participants.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-xs text-rose-500 hover:text-rose-700 font-bold transition-colors"
            >
              全部清空
            </button>
          )}
        </div>

        {participants.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3 opacity-60">
            <Users className="w-12 h-12" />
            <p className="text-sm font-medium">目前名單空空如也</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-2">
              {participants.map((p, idx) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-3 rounded-xl group transition-all ${
                      isDuplicate 
                        ? 'bg-rose-50 border border-rose-100' 
                        : 'bg-slate-50 border border-transparent hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400 w-4">{idx + 1}</span>
                      <span className={`font-bold ${isDuplicate ? 'text-rose-700' : 'text-slate-700'}`}>
                        {p.name}
                      </span>
                      {isDuplicate && (
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-black">重複</span>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(p.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterManager;
