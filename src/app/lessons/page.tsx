import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function LessonsPage() {
  const supabase = await createClient();
  
  // Fetch lessons từ DB thật, sắp xếp theo sort_order
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !lessons) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-gray-500">Không thể kết nối đến cơ sở dữ liệu. Vui lòng kiểm tra lại cấu hình Supabase.</p>
        <p className="text-sm text-gray-400 mt-4 font-mono bg-gray-50 p-4 inline-block rounded-xl">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-blue-900 mb-4">Lộ Trình Học Tập</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Các bài học được sắp xếp từ cơ bản đến nâng cao. Khám phá Kinh Thánh, 
          câu chuyện cứu độ và ý nghĩa từng phần trong phụng vụ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <Link 
            key={lesson.id} 
            href={lesson.is_unlocked ? `/lessons/${lesson.id}` : "#"}
            className={`block group border rounded-2xl p-6 transition-all ${
              lesson.is_unlocked 
                ? "bg-white border-blue-100 hover:border-blue-300 hover:shadow-md cursor-pointer" 
                : "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                {lesson.category}
              </span>
              {!lesson.is_unlocked && (
                <span className="text-gray-400 font-medium text-sm flex items-center gap-1">🔒 Đã Khóa</span>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">
              {lesson.title}
            </h2>
            
            <p className="text-gray-600 mb-6 line-clamp-2">
              {lesson.description}
            </p>
            
            <div className="flex items-center text-sm font-medium text-gray-500 gap-4">
              <span className="flex items-center gap-1">
                ⏱️ {lesson.duration} phút
              </span>
              {lesson.is_unlocked && (
                <span className="text-blue-600 ml-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Vào học ngay &rarr;
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
