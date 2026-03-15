"use client";

import React, { useState } from "react";
import { Play, Pause, CheckCircle, Save, BookOpen, Quote, Heart, Footprints } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Glossary } from "@/lib/data";

type TabType = 'read' | 'reflect' | 'pray' | 'act';

// Component con để render Text với Tooltip từ Glossary
const RichTextWithGlossary = ({ text, glossaries }: { text: string, glossaries: Glossary[] }) => {
  // Tìm kiếm sự xuất hiện của các từ glossary trong text và gói bằng <span> tooltip
  let processedElements: (string | React.JSX.Element)[] = [text];

  glossaries.forEach((glossary) => {
    const nextElements: (string | React.JSX.Element)[] = [];
    processedElements.forEach((el, idx) => {
      if (typeof el === 'string') {
        const parts = el.split(new RegExp(`(${glossary.term})`, 'gi'));
        parts.forEach((part, partIdx) => {
          if (part.toLowerCase() === glossary.term.toLowerCase()) {
            nextElements.push(
              <span key={`${glossary.id}-${idx}-${partIdx}`} className="group relative inline-block cursor-help border-b border-dashed border-blue-400 text-blue-800 font-medium">
                {part}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-sm text-slate-100 opacity-0 shadow-xl transition-all group-hover:opacity-100 z-50">
                  <span className="block font-bold text-blue-300 mb-1">{glossary.term}</span>
                  {glossary.definition}
                  <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900"></span>
                </span>
              </span>
            );
          } else {
            nextElements.push(part);
          }
        });
      } else {
        nextElements.push(el);
      }
    });
    processedElements = nextElements;
  });

  return <>{processedElements.map((el, i) => <span key={i}>{el}</span>)}</>;
};


export default function InteractiveLessonClient({ 
  lesson, 
  glossaries 
}: { 
  lesson: any; 
  glossaries: Glossary[];
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [reflectionText, setReflectionText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  
  const [isCompleted, setIsCompleted] = useState(false);

  // Lưu trữ tham chiếu utterance cho Web Speech API
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    // Khởi tạo Text-to-Speech (TTS) đọc nội dung bài học
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const textToRead = lesson.read_content || lesson.description;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "vi-VN"; // Chọn giọng Tiếng Việt
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utteranceRef.current = utterance;
    }

    // Dọn dẹp TTS khi component unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lesson.read_content, lesson.description]);

  React.useEffect(() => {
    // Cập nhật tốc độ đọc TTS khi đổi Speed
    if (utteranceRef.current) {
      utteranceRef.current.rate = playbackSpeed;
      // Trình duyệt đòi hỏi phải restart để áp dụng tốc độ mới nếu đang đọc
      if (isPlaying && window.speechSynthesis) {
         window.speechSynthesis.cancel();
         window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  }, [playbackSpeed, isPlaying]);

  const toggleAudio = () => {
    if (!window.speechSynthesis || !utteranceRef.current) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  };

  const handleSaveReflection = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    // TODO: Supabase Save logic
  };

  const tabs: {id: TabType, label: string, icon: any}[] = [
    { id: 'read', label: 'Lời Chúa', icon: BookOpen },
    { id: 'reflect', label: 'Suy Ngẫm', icon: Quote },
    { id: 'pray', label: 'Cầu Nguyện', icon: Heart },
    { id: 'act', label: 'Hành Động', icon: Footprints },
  ];

  return (
    <>
      <div className="mb-10 text-center max-w-2xl mx-auto">
         <p className="text-gray-600 leading-relaxed text-lg">{lesson.description}</p>
      </div>

      {/* Audio Player Nâng cao */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={toggleAudio}
            className="w-14 h-14 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div className="flex-1">
            <p className="font-bold text-gray-900">Bản thu âm bài học (AI Bot)</p>
            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-gray-500">
              <button 
                onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                className="px-2 py-1 rounded bg-white border border-gray-200 hover:border-blue-400 transition"
              >
                Tốc độ: {playbackSpeed}x
              </button>
              <button 
                onClick={() => setIsAmbientOn(!isAmbientOn)}
                className={`px-2 py-1 rounded border transition ${isAmbientOn ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-200 hover:border-blue-400'}`}
              >
                Nhạc thiền: {isAmbientOn ? 'BẬT' : 'TẮT'}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/3 h-1.5 bg-blue-200/50 rounded-full relative shrink-0 overflow-hidden">
          <div className={`absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000 ${isPlaying ? 'w-1/3' : 'w-0'}`}></div>
        </div>
      </div>

      {/* Tabs / 4 Bước Lectio Divina */}
      <div className="mb-12">
        <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-gray-50/50 p-1.5 rounded-2xl mb-8 overflow-x-auto nice-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm md:text-base font-bold transition-all whitespace-nowrap ${
                  isActive ? "text-blue-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Areas */}
        <div className="min-h-[300px] bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'read' && (
              <motion.div
                key="read"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-serif"
              >
                <div className="float-right ml-6 mb-4 w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Đọc Lời Chúa</h3>
                {lesson.read_content.split("\n").map((paragraph: string, index: number) => (
                  <p key={index} className="mb-6">
                    <RichTextWithGlossary text={paragraph} glossaries={glossaries} />
                  </p>
                ))}
              </motion.div>
            )}

            {activeTab === 'reflect' && (
              <motion.div
                key="reflect"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mx-auto max-w-3xl">
                  <div className="bg-yellow-50/50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mb-8">
                    <Quote className="w-8 h-8 text-yellow-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3 block">Suy Ngẫm</h3>
                    <p className="text-lg text-gray-700 italic font-serif leading-relaxed">
                      "{lesson.reflect_question || "Điều gì đánh động bạn nhất trong bài học này?"}"
                    </p>
                  </div>
                  
                  <div className="bg-white border rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        Sổ tay thiêng liêng
                      </span>
                    </div>
                    <textarea 
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Viết những suy nghĩ riêng tư của bạn vào đây..."
                      className="w-full min-h-[150px] p-4 bg-transparent outline-none resize-y text-gray-700 leading-relaxed"
                    />
                    <div className="flex justify-end p-2 border-t border-gray-50">
                      <button 
                        onClick={handleSaveReflection}
                        disabled={!reflectionText.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition"
                      >
                        {isSaved ? <><CheckCircle className="w-4 h-4" /> Đã lưu vào Sổ tay</> : <><Save className="w-4 h-4" /> Lưu lại</>}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pray' && (
              <motion.div
                key="pray"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="text-center py-8"
              >
                 <div className="inline-flex w-16 h-16 bg-red-50 text-red-500 rounded-full items-center justify-center mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-widest text-red-900/40">Cầu Nguyện</h3>
                <div className="relative inline-block mx-auto max-w-2xl px-8">
                  <span className="text-6xl text-red-100 absolute -top-4 -left-2 font-serif">"</span>
                  <p className="text-2xl md:text-3xl font-serif text-gray-800 leading-snug">
                    {lesson.pray_content || "Lạy Chúa, xin thương xót con là kẻ có tội."}
                  </p>
                  <span className="text-6xl text-red-100 absolute -bottom-10 -right-2 font-serif line-height-[0]">"</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'act' && (
              <motion.div
                key="act"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 mb-10 text-center mx-auto max-w-3xl">
                  <div className="inline-flex w-16 h-16 bg-white text-green-600 rounded-full items-center justify-center mb-6 shadow-sm">
                    <Footprints className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-4 block">Quyết Tâm Sống Đạo</h3>
                  <p className="text-xl text-green-800 font-medium">
                    {lesson.act_content || "Hôm nay, hãy mỉm cười với một người bạn gặp trên đường."}
                  </p>
                </div>

                {/* Completion Action */}
                <div className="pt-10 border-t border-gray-100 flex flex-col items-center">
                  <p className="text-gray-500 mb-6 text-center">
                    Bạn đã hoàn thành 4 bước bài học. Xác nhận hoàn thành ngay!
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
