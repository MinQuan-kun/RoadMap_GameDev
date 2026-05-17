import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, LayoutDashboard, Briefcase, Map, Settings, PlusSquare, Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import Dashboard from '../components/profile/Dashboard'
import MyJobs from '../components/profile/MyJobs';
import Setting from '../components/profile/Setting';
import RoadmapBuilder from './RoadmapBuilder';
import MyRoadMap from '../components/profile/MyRoadMap';
import RecruiterManagement from '../components/profile/RecruiterManagement';
import FollowedPathways from '../components/profile/FollowedPathways';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('MyRoadMap');
  const [editingRoadmapId, setEditingRoadmapId] = useState(null);
  const [builderSessionKey, setBuilderSessionKey] = useState(0);
  const location = useLocation();
  const isRecruiter = user?.role === 2;

  const sideMenu = [
    { id: 'DashBoard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'ProfileInfo', label: 'Hồ sơ của tôi', icon: User },
    { id: 'MyJob', label: isRecruiter ? 'Quản lý tuyển dụng' : 'Việc làm của tôi', icon: Briefcase },
    { id: 'MyRoadMap', label: 'Lộ trình của tôi', icon: Map },
    { id: 'FollowedPathways', label: 'Tôi đã theo dõi', icon: Star },
    { id: 'CreateRoadmap', label: 'Tạo lộ trình', icon: PlusSquare },
    { id: 'Setting', label: 'Cài đặt', icon: Settings },
  ];

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clean up state so refresh doesn't stick
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  // Build profile from real user context data instead of hardcoded
  const profileData = {
    name: user?.fullName || user?.userName || 'User',
    userName: `@${user?.userName || 'user'}`,
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    coverUrl: user?.coverUrl || '',
    skills: user?.skills || [],
    links: user?.links || {},
    completedNodes: user?.completedNodes || [],
  };

  // Callback when profile is updated (from ProfileInfo edit)
  const handleProfileUpdated = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }))
  }

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
          {activeTab === 'ProfileInfo' && <ProfileInfo profile={profileData} onProfileUpdated={handleProfileUpdated} />}

          {activeTab === 'MyJob' && (
            isRecruiter
              ? <RecruiterManagement />
              : <div className="flex-1 p-8 md:p-12 overflow-y-auto"><MyJobs /></div>
          )}

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
          {activeTab === 'FollowedPathways' && <FollowedPathways />}
          {activeTab === 'Setting' && <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar"><Setting /></div>}

        </main>

      </div>
    </div>
  );
};

export default UserProfile;