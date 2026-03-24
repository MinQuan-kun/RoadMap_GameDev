import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Rocket, Loader2, Gamepad2, Target, Cpu } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import apiClient from '../services/apiClient';

const CareerQuiz = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getVisibleQuestions = () => {
    return questions.filter(q => {
      if (!q.parentQuestionId) return true;
      const parentAnswer = userAnswers[q.parentQuestionId];
      return parentAnswer === q.requiredOptionText;
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentIndex];

  const handleOptionSelect = (option) => {
    setDirection(1);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option.text
    }));

    setSelectedNodeIds(prev => [...new Set([...prev, ...option.mappingNodes])]);

    if (currentIndex < visibleQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      userId: user?.id,
      selectedNodeIds: selectedNodeIds,
      skipBasics: userAnswers[visibleQuestions[0].id] !== "Beginner (chưa từng làm game)"
    };

    try {
      const res = await apiClient.post('/quiz/submit', payload);
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem('hasCompletedQuiz', 'true');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert("Lỗi khi lưu lộ trình!");
    }
  };

  // Các biến thể Animation cho Framer Motion
  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 })
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors duration-300">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-500" size={64} />
        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
      </div>
      <p className="mt-8 font-black tracking-[0.3em] text-blue-500 animate-pulse">LOADING SYSTEM...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex items-center justify-center p-4 md:p-10 relative overflow-hidden transition-colors duration-300">

      {/* Background*/}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-5xl z-10">
        {/* Header*/}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-blue-500 font-black uppercase tracking-widest text-xs"
              >
                Giai đoạn {currentIndex + 1} / {visibleQuestions.length}
              </motion.span>
              <h2 className="text-slate-500 text-sm font-bold uppercase mt-1 tracking-tighter">Roadmap Initialization</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(((currentIndex + 1) / visibleQuestions.length) * 100)}%</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full p-[2px] border border-slate-300 dark:border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / visibleQuestions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* khu vực Question */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-12"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-snug pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                {currentQuestion?.questionText}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {currentQuestion?.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(opt)}
                    className={`group p-8 rounded-[2.5rem] text-left relative overflow-hidden transition-all border-2 ${userAnswers[currentQuestion.id] === opt.text
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                      : 'bg-white dark:bg-white/5 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md dark:border-white/5 dark:hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`h-16 w-16 rounded-3xl flex items-center justify-center transition-colors ${userAnswers[currentQuestion.id] === opt.text ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-white/10 group-hover:text-blue-600 dark:group-hover:text-white'
                        }`}>
                        <Sparkles size={32} />
                      </div>
                      {/* Trong phần render options */}
                      <div className="flex-1">
                        <span className="text-xl md:text-2xl font-bold block leading-normal pb-1">
                          {opt.text}
                        </span>
                        <span className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                          Select Option
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full translate-x-16 -translate-y-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-20 flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5">
          <button
            onClick={() => { setDirection(-1); setCurrentIndex(prev => prev - 1); }}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-8 py-4 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all font-black text-xs uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={20} /> Back
          </button>

          {currentIndex === visibleQuestions.length - 1 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(37,99,235,0.5)" }}
              onClick={handleSubmit}
              className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] flex items-center gap-4 transition-all"
            >
              Nhận Roadmap <Rocket size={20} className="animate-bounce" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerQuiz;