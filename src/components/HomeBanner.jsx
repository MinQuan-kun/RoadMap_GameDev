import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const HomeBanner = ({ onOpenLogin, onOpenRegister, onBrowseJobs, lightImage, darkImage, isDarkMode }) => {
    const { user, isAuthenticated } = useContext(AuthContext);

    // Chọn ảnh dựa trên chế độ hiện tại
    const currentImage = isDarkMode ? darkImage : lightImage;

    return (
        <section className="relative flex min-h-[550px] flex-col items-center justify-center overflow-hidden border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050505] px-4 py-20 text-center transition-colors duration-500">

            {currentImage && (
                <>
                    <img
                        key={isDarkMode ? 'dark' : 'light'} 
                        src={currentImage}
                        alt="Banner Background"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 dark:opacity-40 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent dark:via-black/60 dark:to-[#050505]" />
                </>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
                    {isAuthenticated
                        ? `Welcome, ${user?.fullName || user?.username || 'Gamedev'}`
                        : "Welcome to GameNode"}
                </h1>

                <div className="mx-auto mb-10 max-w-2xl">
                    <p className="text-lg leading-8 text-slate-600 dark:text-slate-400 md:text-xl">
                        {isAuthenticated
                            ? "Tiếp tục hành trình chinh phục các kỹ năng mới và khám phá những cơ hội nghề nghiệp phù hợp với lộ trình của bạn."
                            : "Khám phá các lộ trình học tập miễn phí và đưa kỹ năng phát triển game của bạn lên một tầm cao mới."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={isAuthenticated ? onBrowseJobs : onOpenLogin}
                        className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        {isAuthenticated ? "Explore Careers" : "Take a Quiz"}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;