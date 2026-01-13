
import React, { useState, useEffect } from 'react';
import { Tab, Participant } from './types';
import RosterManager from './components/RosterManager';
import PrizeDraw from './components/PrizeDraw';
import TeamGrouping from './components/TeamGrouping';
import { Users, Gift, LayoutGrid, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ROSTER);
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('hr-toolbox-participants');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hr-toolbox-participants', JSON.stringify(participants));
  }, [participants]);

  const handleUpdateParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Users className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HR <span className="text-indigo-600">活動小幫手</span></h1>
          </div>

          <nav className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
            <TabButton
              active={activeTab === Tab.ROSTER}
              onClick={() => setActiveTab(Tab.ROSTER)}
              icon={<ClipboardList className="w-4 h-4" />}
              label="參與者名單"
            />
            <TabButton
              active={activeTab === Tab.DRAW}
              onClick={() => setActiveTab(Tab.DRAW)}
              icon={<Gift className="w-4 h-4" />}
              label="獎品抽籤"
            />
            <TabButton
              active={activeTab === Tab.GROUPS}
              onClick={() => setActiveTab(Tab.GROUPS)}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="自動分組"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 pb-24 md:pb-8">
        {participants.length === 0 && activeTab !== Tab.ROSTER && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <Users className="w-12 h-12 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">尚未建立名單</h3>
              <p className="text-amber-700 mt-1 max-w-md">請先前往「參與者名單」分頁新增成員姓名。您可以上傳 CSV 檔案或直接貼上姓名清單。</p>
            </div>
            <button
              onClick={() => setActiveTab(Tab.ROSTER)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-semibold"
            >
              立即新增成員
            </button>
          </div>
        )}

        <div className={activeTab === Tab.ROSTER ? 'block' : 'hidden'}>
          <RosterManager
            participants={participants}
            onUpdate={handleUpdateParticipants}
          />
        </div>

        {participants.length > 0 && activeTab === Tab.DRAW && (
          <PrizeDraw participants={participants} />
        )}

        {participants.length > 0 && activeTab === Tab.GROUPS && (
          <TeamGrouping participants={participants} />
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-around z-50">
        <MobileTabButton
          active={activeTab === Tab.ROSTER}
          onClick={() => setActiveTab(Tab.ROSTER)}
          icon={<ClipboardList className="w-6 h-6" />}
          label="名單"
        />
        <MobileTabButton
          active={activeTab === Tab.DRAW}
          onClick={() => setActiveTab(Tab.DRAW)}
          icon={<Gift className="w-6 h-6" />}
          label="抽籤"
        />
        <MobileTabButton
          active={activeTab === Tab.GROUPS}
          onClick={() => setActiveTab(Tab.GROUPS)}
          icon={<LayoutGrid className="w-6 h-6" />}
          label="分組"
        />
      </nav>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active
        ? 'bg-white text-indigo-600 shadow-sm'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
      }`}
  >
    {icon}
    {label}
  </button>
);

const MobileTabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'
      }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
