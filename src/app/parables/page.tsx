import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { BookOpen, Heart, Clock } from "lucide-react";

export default async function ParablesPage() {
  const supabase = await createClient();

  // Lấy dữ liệu từ bảng parables
  const { data: parables, error } = await supabase
    .from("parables")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !parables) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu Suy Niệm</h2>
        <p className="text-gray-500">Vui lòng kiểm tra lại cấu hình Supabase.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
          Góc Suy Niệm
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Đọc và suy ngẫm các Dụ Ngôn của Chúa Giê-su dưới góc nhìn thực tế của đời sống 
          hiện đại. Lời Chúa vẫn luôn sống động giữa nhịp sống hối hả ngày nay.
        </p>
      </div>

      {/* Parables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parables.map((parable) => (
          <div 
            key={parable.id} 
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
          >
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-50 relative overflow-hidden flex items-center justify-center p-6 text-center">
               <span className="text-sm font-serif font-bold italic text-indigo-900 absolute top-4 left-4 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                 {parable.biblical_reference}
               </span>
               <BookOpen className="w-16 h-16 text-blue-200 group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {parable.theme}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" /> {parable.read_time} phút
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-serif line-clamp-2 group-hover:text-blue-600 transition-colors">
                <Link href={`/parables/${parable.id}`} className="focus:outline-none">
                  <span className="absolute inset-0 z-10" aria-hidden="true"></span>
                  {parable.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                {parable.short_description}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto relative z-20">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Heart className="w-4 h-4" /> 
                  <span>{parable.likes}</span>
                </button>
                <Link 
                  href={`/parables/${parable.id}`}
                  className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
