"use client";

import { useState } from "react";
import { Play, Pause, CheckCircle } from "lucide-react";

export default function InteractiveLessonClient({ content }: { content: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <>
      {/* Audio Player */}
      <div className="bg-blue-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-md"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div className="flex-1">
            <p className="font-bold text-gray-900">Nghe bản thu âm bài học</p>
            <p className="text-sm text-gray-500">Giọng đọc: Cha quản xứ</p>
          </div>
        </div>
        <div className="w-full sm:w-1/3 h-2 bg-blue-200 rounded-full relative shrink-0">
          <div className={`absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000 ${isPlaying ? 'w-1/3' : 'w-0'}`}></div>
        </div>
      </div>

      {/* Reading Content */}
      <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-serif">
        {content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-6">{paragraph}</p>
        ))}
      </div>

      {/* Completion Action */}
      <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center">
        <p className="text-gray-500 mb-6 text-center">
          Bạn đã đọc và hiểu rõ nội dung chương này chưa?
        </p>
        <button 
          onClick={() => setIsCompleted(true)}
          disabled={isCompleted}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm ${
            isCompleted 
              ? "bg-green-100 text-green-700 cursor-not-allowed border-green-200 border" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          {isCompleted ? "Đã hoàn thành bài học" : "Đánh dấu hoàn thành (+10 XP)"}
        </button>
      </div>
    </>
  );
}
