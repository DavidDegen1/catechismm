"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, Home, RefreshCcw } from "lucide-react";
import { cn } from "@/utils/cn";

type QuizQuestion = {
  id: string;
  lesson_id: string;
  question: string;
  options: any; // JSON array from Supabase
  correct_option_id: string;
  explanation: string;
};

export default function InteractiveQuizClient({ 
  lesson, 
  questions 
}: { 
  lesson: { id: string; title: string }, 
  questions: QuizQuestion[] 
}) {
  const router = useRouter();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Đảm bảo options là mảng nếu đang ở dạng string từ DB JSONB
  const currentQuestion = questions[currentQuestionIndex];
  const parsedOptions = typeof currentQuestion.options === 'string' 
    ? JSON.parse(currentQuestion.options) 
    : currentQuestion.options;

  const isCorrect = selectedOptionId === currentQuestion.correct_option_id;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    
    if (optionId === currentQuestion.correct_option_id) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      // TODO: Call API to save User Progress score here
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    let emoji = "";
    
    if (percentage === 100) {
      message = "Tuyệt vời! Bạn nắm rất vững kiến thức bài học này.";
      emoji = "🌟";
    } else if (percentage >= 50) {
      message = "Khá tốt! Bạn đã hiểu được phần lớn nội dung chính.";
      emoji = "👍";
    } else {
      message = "Cần cố gắng thêm! Hãy ôn lại bài học và thử sức lần nữa nhé.";
      emoji = "💪";
    }

    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100 mt-12">
        <div className="text-6xl mb-6">{emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành Trắc nghiệm</h1>
        <p className="text-gray-500 mb-8 font-medium">Bộ câu hỏi: {lesson.title}</p>
        
        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 rounded-full border-8 border-blue-50 flex flex-col items-center justify-center bg-white shadow-inner relative">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="90" cy="90" r="80" className="stroke-gray-100 stroke-[8px] fill-transparent" />
              <circle cx="90" cy="90" r="80" 
                className="stroke-blue-500 stroke-[8px] fill-transparent transition-all duration-1000 ease-out" 
                strokeDasharray={`${2 * Math.PI * 80}`} 
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-5xl font-black text-blue-600">{score}/{questions.length}</span>
            <span className="text-sm font-bold text-gray-400 mt-1 uppercase">Đúng</span>
          </div>
        </div>
        
        <p className="text-xl text-gray-800 font-medium mb-4">{message}</p>
        
        <div className="bg-orange-50 text-orange-700 py-3 px-6 rounded-xl font-bold inline-block mb-10 border border-orange-100">
          Thưởng: +{score * 25} XP
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleRetry}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" /> Làm lại
          </button>
          <button 
            onClick={() => router.push("/lessons")}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" /> Về bài học
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-4">
        <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</span>
          <span className="text-blue-600">{lesson.title}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="flex flex-col gap-4">
          {parsedOptions.map((option: any) => {
            let buttonStyle = "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
            let OptionIcon = null;

            if (isAnswered) {
              if (option.id === currentQuestion.correct_option_id) {
                buttonStyle = "bg-green-50 border-green-500 text-green-800 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                OptionIcon = <CheckCircle className="w-6 h-6 text-green-500 ml-auto absolute right-5" />;
              } else if (option.id === selectedOptionId) {
                buttonStyle = "bg-red-50 border-red-500 text-red-800";
                OptionIcon = <XCircle className="w-6 h-6 text-red-500 ml-auto absolute right-5" />;
              } else {
                buttonStyle = "bg-white border-gray-100 text-gray-400 opacity-60";
              }
            } else if (selectedOptionId === option.id) {
               buttonStyle = "bg-blue-50 border-blue-500 text-blue-800";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isAnswered}
                className={`relative flex items-center w-full p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all ${buttonStyle}`}
              >
                <span className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full mr-4 text-sm font-bold",
                  isAnswered && option.id === currentQuestion.correct_option_id ? "bg-green-200 text-green-800" :
                  isAnswered && option.id === selectedOptionId ? "bg-red-200 text-red-800" :
                  "bg-gray-100 text-gray-500"
                )}>
                  {option.id}
                </span>
                <span className="pr-10">{option.text}</span>
                {OptionIcon}
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn(
        "transition-all duration-500 overflow-hidden rounded-2xl",
        isAnswered ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
      )}>
        <div className={`p-6 border-2 font-medium ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            {isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
            {isCorrect ? "Chính xác!" : "Chưa đúng rồi!"}
          </h3>
          <p className="leading-relaxed opacity-90">{currentQuestion.explanation}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all",
            isAnswered 
              ? "bg-gray-900 text-white hover:bg-black hover:shadow-lg hover:-translate-y-1" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {currentQuestionIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
