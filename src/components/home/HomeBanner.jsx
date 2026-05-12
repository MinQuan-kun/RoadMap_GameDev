import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const HomeBanner = ({ onOpenLogin, onOpenRegister, onBrowseJobs, settings, isDarkMode }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentImage = isDarkMode ? settings?.bannerDarkImage : settings?.bannerLightImage;

    const hasCompletedQuiz = user?.hasCompletedQuiz;

    return (
        <section className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#050505] px-4 py-24 text-center transition-colors duration-500">

            {/* Background Image with refined overlay */}
            {currentImage && (
                <div className="absolute inset-0 z-0">
                    <img
                        key={isDarkMode ? 'dark' : 'light'}
                        src={currentImage}
                        alt="Banner Background"
                        className="h-full w-full object-cover transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-slate-100/20 to-slate-50 dark:from-[#050505]/50 dark:via-[#050505]/80 dark:to-[#050505]" />
                </div>
            )}

            {/* Decorative animated blobs */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none delay-700" />

            <div className="relative z-10 max-w-5xl mx-auto px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-red-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    The Future of Game Development
                </div>

                <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-7xl lg:text-8xl leading-[1.1]">
                    {isAuthenticated
                        ? (
                            <span className="block">
                                Hey, <span className="text-gradient">{(user?.fullName || user?.username || 'Gamedev')}</span>
                            </span>
                        )
                        : (
                            <span>
                                {settings?.bannerTitle || "Level Up Your"} <span className="text-gradient">Game Dev</span>
                            </span>
                        )}
                </h1>

                <div className="mx-auto mb-12 max-w-2xl">
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl font-medium">
                        {isAuthenticated
                            ? (settings?.bannerDescriptionAuth || "Tiếp tục hành trình chinh phục các kỹ năng mới và khám phá những cơ hội nghề nghiệp phù hợp với lộ trình của bạn.")
                            : (settings?.bannerDescription || "Khám phá các lộ trình học tập miễn phí và đưa kỹ năng phát triển game của bạn lên một tầm cao mới.")}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {(!isAuthenticated || !hasCompletedQuiz) ? (
                        <button
                            onClick={() => isAuthenticated ? navigate('/quiz') : onOpenLogin()}
                            className="group relative inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-base font-bold text-white transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                        >
                            Bắt đầu hành trình của bạn
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/profile', { state: { activeTab: 'MyRoadMap' } })}
                            className="group relative inline-flex items-center gap-3 rounded-2xl bg-slate-200/50 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 px-10 py-5 text-base font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Tiếp tục lộ trình
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;