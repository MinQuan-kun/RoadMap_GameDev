import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Rocket, Loader2, Gamepad2, Target, Cpu, CheckCircle2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import apiClient from '../services/apiClient';

const CareerQuiz = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiClient.get('/quiz/questions');
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const getVisibleQuestions = (currentAnswers = userAnswers) => {
    const visibleIds = new Set();
    const currentVisible = questions.filter(q => !q.parentQuestionId);
    currentVisible.forEach(q => visibleIds.add(q.id));

    let added = true;
    while (added) {
      added = false;
      for (const q of questions) {
        if (!visibleIds.has(q.id) && q.parentQuestionId && visibleIds.has(q.parentQuestionId)) {
          const parentAnswer = currentAnswers[q.parentQuestionId];
          if (parentAnswer && parentAnswer.text === q.requiredOptionText) {
            visibleIds.add(q.id);
            added = true;
          }
        }
      }
    }
    return questions.filter(q => visibleIds.has(q.id));
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentIndex];

  const handleOptionSelect = (option) => {
    setDirection(1);
    
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: option
    };
    
    setUserAnswers(newAnswers);

    const newVisibleQuestions = getVisibleQuestions(newAnswers);

    if (currentIndex < newVisibleQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 400);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalVisibleQuestions = getVisibleQuestions(userAnswers);
    const finalNodeIds = [];
    
    finalVisibleQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans && ans.mappingNodes) {
        finalNodeIds.push(...ans.mappingNodes);
      }
    });

    const uniqueNodeIds = [...new Set(finalNodeIds)];

    const payload = {
      userId: user?.id,
      selectedNodeIds: uniqueNodeIds,
      skipBasics: userAnswers[finalVisibleQuestions[0]?.id]?.text !== "Beginner (chưa từng làm game)"
    };

    try {
      const res = await apiClient.post('/quiz/submit', payload);
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem('hasCompletedQuiz', 'true');
        if (res.data?.roadmapId) {
          navigate(`/roadmap/${res.data.roadmapId}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu lộ trình:", error);
      alert("Đã xảy ra lỗi khi tạo lộ trình của bạn!");
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

  const progress = ((currentIndex + 1) / visibleQuestions.length) * 100;

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
                <Sparkles size={12} /> Bước {currentIndex + 1} / {visibleQuestions.length}
              </motion.span>
              <h2 className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest">Thiết Kế Lộ Trình</h2>
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
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="space-y-8 md:space-y-12"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight md:leading-snug text-slate-800 dark:text-white drop-shadow-sm">
                {currentQuestion?.questionText}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {currentQuestion?.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQuestion.id]?.text === opt.text;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(opt)}
                      className={`group p-6 md:p-8 rounded-[2rem] text-left relative overflow-hidden transition-all duration-300 border backdrop-blur-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-400 dark:border-blue-500/50 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.4)]'
                          : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800/80 shadow-sm hover:shadow-lg'
                      }`}
                    >
                      {/* Glow effect for selected item */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 animate-pulse" />
                      )}

                      <div className="flex items-start md:items-center gap-5 relative z-10">
                        <div className={`mt-1 md:mt-0 shrink-0 h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                            : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
                        }`}>
                          {isSelected ? <CheckCircle2 size={28} /> : <Gamepad2 size={28} />}
                        </div>
                        
                        <div className="flex-1">
                          <span className={`text-lg md:text-xl font-bold block leading-snug transition-colors duration-300 ${
                            isSelected 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}>
                            {opt.text}
                          </span>
                          {opt.description && (
                            <span className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 block font-medium">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Decorative background shape */}
                      {isSelected && (
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 blur-[30px] rounded-full pointer-events-none" />
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
            className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
              currentIndex === 0 || isSubmitting
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ChevronLeft size={20} /> Quay Lại
          </button>

          {currentIndex === visibleQuestions.length - 1 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !userAnswers[currentQuestion.id]}
              className={`px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-sm uppercase tracking-[0.15em] flex items-center gap-3 transition-all duration-300 shadow-xl ${
                !userAnswers[currentQuestion.id] || isSubmitting
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
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default CareerQuiz;