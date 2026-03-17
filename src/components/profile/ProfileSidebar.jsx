import React from 'react';

const ProfileSidebar = ({ sideMenu, activeTab, setActiveTab }) => {
  return (
    <aside className="w-full lg:w-72 border-r border-slate-200 dark:border-white/5 p-6 space-y-8 bg-slate-50/50 dark:bg-black/20 backdrop-blur-xl">
      <div className="px-4 py-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">Menu cá nhân</h2>
        <nav className="space-y-2">
          {sideMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20">
        <p className="text-xs font-bold text-blue-500 mb-1">Cấp độ Player</p>
        <p className="text-lg font-black text-slate-800 dark:text-white mb-3">Level 12 <span className="text-xs font-medium text-slate-400">/ 50</span></p>
        <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-[45%]" />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;