import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Link as LinkIcon, Mail, Pencil, Phone, PlusCircle, User } from 'lucide-react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'

const sideMenu = ['DashBoard', 'MyProfile', 'MyJob', 'MyRoadMap', 'Setting']

const UserProfile = ({ onOpenLogin, onOpenRegister }) => {
  const { user } = useContext(AuthContext)
  const profile = {
    name: user?.fullName || user?.username || 'Username',
    userName: user?.username || 'username',
    email: user?.email || 'email@sample.com',
    phone: '0123 456 789',
    address: 'address',
    birthDate: 'Date of birth',
    link: 'Personal link'
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#2b2b2b,#171717_55%)] text-slate-900">
      <div className="min-h-screen w-full overflow-hidden bg-white shadow-2xl shadow-black/20">
        <Header onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />

        <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-[230px_1fr]">
            <aside className="border-r border-slate-300 px-5 py-7">
              <div className="space-y-4">
                {sideMenu.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-md px-4 py-4 text-center text-sm font-semibold transition ${item === 'MyProfile' ? 'bg-[#dcd1f1] text-slate-800 shadow-sm' : 'bg-[#eadffd] text-slate-600 hover:bg-[#dfd2f8]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </aside>

            <main className="px-4 py-8 sm:px-6 lg:px-10">
              <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900">My Profile</h1>

              <section className="mb-8 rounded-sm bg-[#f4f4f4] p-6">
                <div className="grid gap-8 lg:grid-cols-[140px_1fr_auto] lg:items-start">
                  <div className="flex justify-center lg:justify-start">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
                      alt="profile"
                      className="h-28 w-28 rounded-full object-cover"
                    />
                  </div>

                  <div className="grid gap-5 text-sm text-slate-700 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="flex items-center gap-3"><User className="h-4 w-4" /> {profile.userName}</p>
                      <p className="flex items-center gap-3"><Phone className="h-4 w-4" /> {profile.phone}</p>
                      <p className="flex items-center gap-3"><Mail className="h-4 w-4" /> {profile.email}</p>
                    </div>
                    <div className="space-y-3">
                      <p>{profile.address}</p>
                      <p>{profile.birthDate}</p>
                      <p className="flex items-center gap-3"><LinkIcon className="h-4 w-4" /> {profile.link}</p>
                    </div>
                  </div>

                  <button type="button" className="text-slate-700 transition hover:text-slate-900">
                    <Pencil className="h-6 w-6" />
                  </button>
                </div>
              </section>

              <section className="space-y-7">
                {[
                  {
                    title: 'About me',
                    content: 'Game developer interested in gameplay systems, engine architecture and rapid prototyping with Unity and Unreal.'
                  },
                  {
                    title: 'Education',
                    content: 'Bachelor of Software Engineering. Focusing on graphics, real-time systems and game production workflow.'
                  },
                  {
                    title: 'Skill',
                    content: 'Unity, Unreal Engine, C#, C++, Gameplay Programming, Git, Shader Graph.'
                  }
                ].map((section) => (
                  <div key={section.title} className="rounded-sm bg-[#f4f4f4] px-6 py-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{section.title}</h2>
                      <PlusCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="max-w-4xl text-sm leading-7 text-slate-600">{section.content}</p>
                  </div>
                ))}
              </section>

            </main>
        </div>
      </div>
    </div>
  )
}

export default UserProfile