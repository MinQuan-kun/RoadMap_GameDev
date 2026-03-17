import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Github, 
  Globe, 
  ChevronUp 
} from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Học tập',
      links: ['Roadmaps', 'Khóa học Unity', 'Khóa học Unreal', 'Game Design'],
    },
    {
      title: 'Tài liệu',
      links: ['Learnanythingxyz', 'Unity Course', 'UnrealEngine Course', 'RoadMapSh'],
    },
    {
      title: 'Thông tin',
      links: ['Về GameNode', 'Đội ngũ phát triển'],
    },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg shadow-lg shadow-blue-500/20 overflow-hidden">
              <img
                src="/Img/logo.png"
                alt="GameNode Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
              <span>GameNode</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
              Nền tảng học tập và định hướng nghề nghiệp cho Game Developer.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Facebook className="h-5 w-5 hover:text-blue-600 cursor-pointer transition-colors" />
              <Github className="h-5 w-5 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Cột Links - Chiếm 3 cột còn lại */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5"> {/* Giảm space-y từ 4 xuống 2.5 để link khít hơn */}
                {section.links.map((link) => (
                  <li key={link}>
                    <Link 
                      to="#" 
                      className="text-[14px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Phần 3: Bottom Bar - Tối giản khoảng cách */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest text-center md:text-left">
            <span>© 2026 GameNode Inc.</span>
            <span className="normal-case font-medium text-slate-400 dark:text-slate-600 italic">
              (Đây là đồ án cho môn học thực hành nghề nghiệp 2026)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              <Globe className="h-3 w-3" />
              Tiếng Việt
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-1.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;