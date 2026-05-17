import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Rocket, Loader2, Gamepad2, Target, Cpu, CheckCircle2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { getActiveQuiz, submitQuiz } from '../services/roadmapApi';

const CareerQuiz = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getActiveQuiz();
        setQuizInfo(data);
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option) => {
    if (currentQuestion.type === 'multi_choice') {
      const currentAnswersStr = userAnswers[currentQuestion.id] || "";
      let currentAnswers = currentAnswersStr ? currentAnswersStr.split(',').map(s => s.trim()) : [];
      
      if (currentAnswers.includes(option.text)) {
        currentAnswers = currentAnswers.filter(a => a !== option.text);
      } else {
        currentAnswers.push(option.text);
      }
      
      const newAnswers = { ...userAnswers };
      if (currentAnswers.length > 0) {
        newAnswers[currentQuestion.id] = currentAnswers.join(',');
      } else {
        delete newAnswers[currentQuestion.id];
      }
      setUserAnswers(newAnswers);
    } else {
      const newAnswers = {
        ...userAnswers,
        [currentQuestion.id]: option.text
      };
      setUserAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (timeoutRef.current) return;

    const currentAnswer = userAnswers[currentQuestion.id];
    if (currentAnswer === "Tìm việc làm") {
      navigate('/Jobs');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      alert(`Vui lòng trả lời đầy đủ các câu hỏi! (Còn ${unansweredCount} câu)`);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      quizId: quizInfo.id,
      answers: userAnswers
    };

    try {
      const res = await submitQuiz(payload);
      if (user) {
        setUser({ ...user, hasCompletedQuiz: true });
      }
      // Navigate to the result page with the result ID
      navigate(`/survey/result/${res.id}`, { state: { result: res } });
    } catch (error) {
      console.error("Lỗi khi nộp bài khảo sát:", error);
      alert("Đã xảy ra lỗi khi tính toán lộ trình của bạn!");
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0, scale: 0.95 })
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors duration-500">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-500" size={64} />
        <div className="absolute inset-0 blur-xl bg-blue-500/30 animate-pulse rounded-full" />
      </div>
      <p className="mt-8 font-black tracking-[0.2em] text-blue-500 animate-pulse">KHỞI TẠO HỆ THỐNG...</p>
    </div>
  );

  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors duration-500 p-6 text-center">
        <Target size={80} className="text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <h2 className="text-3xl font-bold mb-4">Chưa có dữ liệu bài khảo sát</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg">
          Hệ thống hiện chưa có bộ câu hỏi khảo sát nào được thiết lập. Vui lòng liên hệ Admin hoặc quay lại sau.
        </p>
        <button onClick={() => navigate('/')} className="mt-10 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // Progress chỉ đạt 100% khi isSubmitting = true
  const progress = isSubmitting ? 100 : Math.max(5, (currentIndex / (questions.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden transition-colors duration-500">

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-5xl z-10 relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/5 p-6 md:p-12">

        {/* Header / Progress Bar */}
        <div className="mb-12 md:mb-16">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-3"
              >
                <Sparkles size={12} /> Bước {currentIndex + 1} / {questions.length}
              </motion.span>
              <h2 className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest">{quizInfo?.title || "Thiết Kế Lộ Trình"}</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-300/50 dark:border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>

        {/* Question Area */}
        <div className="relative min-h-[400px] md:min-h-[450px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion?.id || currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="space-y-8 md:space-y-12"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight md:leading-snug text-slate-800 dark:text-white drop-shadow-sm">
                {currentQuestion?.question}
              </h1>

              <div className="flex flex-col gap-4">
                {currentQuestion?.options.map((opt, idx) => {
                  const isSelected = currentQuestion.type === 'multi_choice' 
                    ? (userAnswers[currentQuestion.id] && userAnswers[currentQuestion.id].split(',').map(s => s.trim()).includes(opt.text))
                    : userAnswers[currentQuestion.id] === opt.text;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01, x: 8 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOptionSelect(opt)}
                      className={`group p-5 md:p-6 rounded-2xl text-left relative overflow-hidden transition-all duration-300 border backdrop-blur-md flex items-center justify-between ${isSelected
                        ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/40 dark:to-indigo-900/40 border-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
                        : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/50 hover:border-blue-400/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                        }`}
                    >
                      {/* Left color bar indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${isSelected ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-transparent group-hover:bg-blue-400/50'
                        }`} />

                      <div className="flex items-center gap-5 ml-2 relative z-10 w-full">
                        <div className={`shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ${isSelected
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                          }`}>
                          {isSelected ? <CheckCircle2 size={24} /> : <span className="font-bold text-lg">{String.fromCharCode(65 + idx)}</span>}
                        </div>

                        <div className="flex-1 pr-4">
                          <span className={`text-lg font-bold block transition-colors duration-300 ${isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}>
                            {opt.text}
                          </span>
                          {opt.description && (
                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Decorative background shape */}
                      {isSelected && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[30px] rounded-full pointer-events-none" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 md:mt-12 flex justify-between items-center pt-8 border-t border-slate-200/50 dark:border-white/10">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0 || isSubmitting}
            className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 ${currentIndex === 0 || isSubmitting
              ? 'opacity-30 cursor-not-allowed text-slate-400'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <ChevronLeft size={20} /> Quay Lại
          </button>

          {currentIndex < questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!userAnswers[currentQuestion.id]}
              className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 ${!userAnswers[currentQuestion.id]
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                }`}
            >
              Tiếp Theo <ChevronRight size={20} />
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !userAnswers[currentQuestion.id]}
              className={`px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-sm uppercase tracking-[0.15em] flex items-center gap-3 transition-all duration-300 shadow-xl ${!userAnswers[currentQuestion.id] || isSubmitting
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/40 hover:shadow-blue-500/60'
                }`}
            >
              {isSubmitting ? (
                <>Đang Xử Lý... <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <>Nhận Roadmap <Rocket size={20} className="animate-bounce" /></>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* CSS cho hiệu ứng shimmer */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default CareerQuiz;