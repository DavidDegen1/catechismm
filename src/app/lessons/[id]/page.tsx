import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import InteractiveLessonClient from "./InteractiveLessonClient";

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;

  // Fetch dữ liệu bài học từ Supabase khớp ID
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy bài học!</h2>
        <p className="text-gray-500 mb-6">Bài học có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
        <Link href="/lessons" className="text-blue-600 underline font-medium hover:text-blue-800">
           Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Fetch từ vựng liên quan
  const { data: glossaries } = await supabase
    .from("glossaries")
    .select("*")
    .eq("related_lesson_id", resolvedParams.id);

  // Fallback tạm thời nếu read_content trong DB rỗng
  const readContent = lesson.read_content || `
    Thiên Chúa sáng tạo trời đất. Đất còn trống rỗng, chưa có hình thể, bóng tối bao trùm vực thẳm, và thần khí Thiên Chúa bay lượn trên mặt nước.
    Thiên Chúa phán: "Phải có ánh sáng." Liền có ánh sáng. Thiên Chúa thấy ánh sáng tốt đẹp. Thiên Chúa phân rẽ ánh sáng và bóng tối...
    
    Trong suốt 6 ngày, Người dựng nên bầu trời, đất liền, biển tụ, cỏ cây, tinh tú, chim cá, muôn thú. Ở đỉnh cao sáng tạo của Người, Người dựng nên con người theo hình ảnh Người, có nam có nữ. "Thiên Chúa thấy mọi sự Người đã làm ra quả là rất tốt đẹp."
    
    => Ngày Sabát: Ngày nghỉ ngơi thánh thiêng để chúc tụng sự quan phòng vĩ đại của Người đối với vạn vật.
  `;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Link 
        href="/lessons"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Danh sách bài học
      </Link>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <header className="mb-10 text-center border-b border-gray-100 pb-8">
          <span className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3 block">
            {lesson.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-lg text-gray-500 italic">
            Thời lượng dự kiến: {lesson.duration} phút
          </p>
        </header>

        <InteractiveLessonClient 
          lesson={{
            ...lesson,
            read_content: readContent
          }} 
          glossaries={glossaries || []} 
        />
      </div>
    </div>
  );
}
