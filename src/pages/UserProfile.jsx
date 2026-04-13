import React, { useContext, useState } from 'react';
import { User, LayoutDashboard, Briefcase, Map, Settings, PlusSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import Dashboard from '../components/profile/Dashboard'
import MyJobs from '../components/profile/MyJobs';
import Setting from '../components/profile/Setting';
import RoadmapBuilder from './RoadmapBuilder';
import MyRoadMap from '../components/profile/MyRoadMap';

const sideMenu = [
  { id: 'DashBoard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'MyProfile', label: 'Hồ sơ của tôi', icon: User },
  { id: 'MyJob', label: 'Việc làm của tôi', icon: Briefcase },
  { id: 'MyRoadMap', label: 'Lộ trình của tôi', icon: Map },
  { id: 'CreateRoadmap', label: 'Tạo lộ trình', icon: PlusSquare },
  { id: 'Setting', label: 'Cài đặt', icon: Settings },
];

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('MyProfile');
  const [editingRoadmapId, setEditingRoadmapId] = useState(null);
  const [builderSessionKey, setBuilderSessionKey] = useState(0);

  const handleTabChange = (tabId) => {
    if (tabId === 'CreateRoadmap' && editingRoadmapId === null) {
      setEditingRoadmapId(null)
    }
    setActiveTab(tabId)
  }

  const handleCreateRoadmap = () => {
    setEditingRoadmapId(null)
    setBuilderSessionKey((prev) => prev + 1)
    setActiveTab('CreateRoadmap')
  }

  const handleEditRoadmap = (roadmapId) => {
    setEditingRoadmapId(roadmapId)
    setActiveTab('CreateRoadmap')
  }

  const handleRoadmapSaved = ({ mode }) => {
    if (mode === 'create') {
      setEditingRoadmapId(null)
      setBuilderSessionKey((prev) => prev + 1)
      setActiveTab('CreateRoadmap')
      return
    }

    setActiveTab('MyRoadMap')
  }

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
          setActiveTab={handleTabChange}
        />

        <main className="flex-1 flex flex-col min-w-0">
          {activeTab === 'DashBoard' && <div className="p-8 md:p-12 overflow-y-auto flex-1"><Dashboard /></div>}
          {activeTab === 'MyProfile' && <ProfileInfo profile={profileData} />}

          {activeTab === 'MyJob' && <div className="flex-1 p-8 md:p-12 overflow-y-auto"><MyJobs /></div>}

          {activeTab === 'CreateRoadmap' && (
            <div className="flex-1 overflow-hidden p-4 md:p-6">
              <div className="h-full rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <RoadmapBuilder
                  key={builderSessionKey}
                  embedded
                  roadmapId={editingRoadmapId}
                  onSaved={handleRoadmapSaved}
                />
              </div>
            </div>
          )}

          {activeTab === 'MyRoadMap' && <MyRoadMap onCreate={handleCreateRoadmap} onEdit={handleEditRoadmap} />}
          {activeTab === 'Setting' && <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar"><Setting /></div>};

        </main>

      </div>
    </div>
  );
};

export default UserProfile;