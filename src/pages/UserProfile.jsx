import React, { useContext, useState } from 'react';
import { User, LayoutDashboard, Briefcase, Map, Settings } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import Dashboard from '../components/profile/Dashboard'
import MyJobs from '../components/profile/MyJobs';
import Setting from '../components/profile/Setting';

const sideMenu = [
  { id: 'DashBoard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'MyProfile', label: 'Hồ sơ của tôi', icon: User },
  { id: 'MyJob', label: 'Việc làm của tôi', icon: Briefcase },
  { id: 'MyRoadMap', label: 'Lộ trình của tôi', icon: Map },
  { id: 'Setting', label: 'Cài đặt', icon: Settings },
];

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('MyProfile');

  const profileData = {
    name: user?.fullName || 'LaoGiCungTon',
    userName: `@${user?.username || 'nhon_gamedev'}`,
    email: user?.email || 'nhon.dev@example.com',
    phone: '0987 654 321',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    birthDate: '20 tháng 10, 2004',
    bio: 'Đam mê phát triển hệ thống gameplay, kiến trúc engine và tạo mẫu nhanh với Unity & Unreal Engine.'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">

        <ProfileSidebar
          sideMenu={sideMenu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 flex flex-col min-w-0">
          {activeTab === 'DashBoard' && <div className="p-8 md:p-12 overflow-y-auto flex-1"><Dashboard /></div>}
          {activeTab === 'MyProfile' && <ProfileInfo profile={profileData} />}

          {activeTab === 'MyJob' && <div className="flex-1 p-8 md:p-12 overflow-y-auto"><MyJobs /></div>}

          {(activeTab === 'MyRoadMap') && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[50px] rounded-full animate-pulse" />
                <div className="relative h-24 w-24 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6">
                  {activeTab === 'MyRoadMap' ? (
                    <Map size={40} className="text-blue-500 animate-bounce" />
                  ) : (
                    <Settings size={40} className="text-slate-400 animate-spin-slow" />
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                Tính năng đang phát triển
              </h2>
              <p className="max-w-xs text-slate-500 dark:text-slate-400 font-medium">
                Chúng tôi đang nỗ lực hoàn thiện phần <span className="text-blue-500">{activeTab === 'MyRoadMap' ? 'Lộ trình' : 'Cài đặt'}</span>. Vui lòng quay lại sau nhé!
              </p>

              <button
                onClick={() => setActiveTab('DashBoard')}
                className="mt-8 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
              >
                Quay lại Bảng điều khiển
              </button>
            </div>
          )}
          {activeTab === 'Setting' && <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar"><Setting /></div>};

        </main>

      </div>
    </div>
  );
};

export default UserProfile;