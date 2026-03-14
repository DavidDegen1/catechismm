"use client";

import { useState, useEffect } from "react";
import { Book, Calendar, PenLine, Save, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  // Load diaries từ mock / fake guest ID
  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    setIsLoading(true);
    // TODO: Khi nối DB Auth xong, thay bằng lấy Auth user_id. 
    // Hiện tại fetch all cho demo mục đích
    const { data } = await supabase
      .from("diaries")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) setEntries(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    // Tạo record mới (Chưa có user_id vì đang Test)
    const { data, error } = await supabase
      .from("diaries")
      .insert([
        { title: newTitle, content: newContent } // Cần RLS của Auth bỏ qua Null userId nếu Test.
      ])
      .select()
      .single();

    if (!error && data) {
      setEntries([data, ...entries]);
    } else {
      console.error("Save Diary Error", error);
      // Fallback UI Only mode nếu RLS block (Do chưa Auth)
      const fakeNewEntry = {
         id: Date.now().toString(),
         title: newTitle,
         content: newContent,
         created_at: new Date().toISOString()
      };
      setEntries([fakeNewEntry, ...entries]);
    }
    
    setIsWriting(false);
    setNewTitle("");
    setNewContent("");
  };

  const handleDelete = async (id: string) => {
    // UI Xóa lạc quan (Optimistic delete) trước
    setEntries(entries.filter(e => e.id !== id));
    
    // DB Xóa thực tế
    await supabase.from("diaries").delete().eq("id", id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
            <Book className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
              Sổ Tay Thiêng Liêng
            </h1>
            <p className="text-gray-500">Giữ lại những tâm tình thay lời tự vấn hàng ngày.</p>
          </div>
        </div>
        
        {!isWriting && (
          <button 
            onClick={() => setIsWriting(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm hover:shadow-md"
          >
            <PenLine className="w-5 h-5" /> Viết trang mới
          </button>
        )}
      </div>

      {/* Write New Entry Form */}
      {isWriting && (
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-lg border border-indigo-100 transform origin-top transition-all animation-fade-in ring-4 ring-indigo-50">
          <input 
            type="text" 
            placeholder="Tiêu đề (VD: Lời tạ ơn hôm nay...)" 
            className="w-full text-2xl font-bold font-serif text-gray-900 placeholder-gray-300 border-none outline-none mb-6 focus:ring-0 bg-transparent"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea 
            placeholder="Chúa đang nói gì với bạn lúc này? Hãy viết dòng suy nghĩ của bạn..." 
            className="w-full h-48 text-lg text-gray-700 placeholder-gray-400 border-none outline-none resize-none focus:ring-0 bg-transparent leading-relaxed"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          ></textarea>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-4">
            <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
               <Calendar className="w-4 h-4"/> Ngày hôm nay
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsWriting(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu trang nhật ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Các ghi chép cũ ({entries.length})</h2>
      
      {isLoading ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
           Đang tải trang sổ tay...
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-500">
          Chưa có nhật ký nào. Lát nữa hãy viết để lưu lại hành trình theo Chúa nhé!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(entry.created_at)}
                </span>
                
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                  title="Xóa trang viết này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-3 line-clamp-1">{entry.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-4">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
