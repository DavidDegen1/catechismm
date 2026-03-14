import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function QuizzesPage() {
  const supabase = await createClient();

  // Lấy các bài học (mỗi bài học đóng vai trò như 1 bộ Câu hỏi)
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, title, is_unlocked, description")
    .order("sort_order", { ascending: true });

  if (error || !lessons) {
     return (
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-500">Vui lòng kiểm tra lại cấu hình Supabase.</p>
        </div>
      );
  }

  // QuizzList tự xây dựng dựa trên thông tin lessons
  const quizzesList = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || "Bài kiểm tra nhanh để củng cố kiến thức đã học.",
      xpReward: 50, // Static XP reward defined dynamically
      isUnlocked: lesson.is_unlocked
  }));

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Luyện Tập Trắc Nghiệm</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Củng cố kiến thức sau mỗi bài học và nhận điểm XP để mở khóa huy hiệu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzesList.map((quiz) => (
          <div key={quiz.id} className={`border p-6 rounded-3xl transition-all ${quiz.isUnlocked ? 'bg-white hover:border-blue-400 hover:shadow-md' : 'bg-gray-50 opacity-70 cursor-not-allowed'}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                ⭐ +{quiz.xpReward} XP
              </span>
              {!quiz.isUnlocked && <span className="text-gray-400 text-sm">🔒 Đã khóa</span>}
            </div>
            
            <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-6 line-clamp-2">{quiz.description}</p>
            
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-sm font-medium text-gray-500">Giới hạn thời gian: Không</span>
              
              {quiz.isUnlocked ? (
                <Link 
                  href={`/quizzes/${quiz.id}`}
                  className="px-5 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition text-sm"
                >
                  Bắt đầu làm
                </Link>
              ) : (
                <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 rounded-full font-medium text-sm">
                  Chưa mở khóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
