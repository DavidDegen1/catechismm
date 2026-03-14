import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import InteractiveQuizClient from "./InteractiveQuizClient";

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // 1. Lấy thông tin bài học (đóng vai trò là thông tin bộ Quiz)
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("id", params.id)
    .single();

  // 2. Lấy danh sách câu hỏi trắc nghiệm thuộc bài học này
  const { data: questions, error: questionsError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("lesson_id", params.id);

  if (lessonError || questionsError || !lesson || !questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chưa có bài kiểm tra cho bài học này.</h2>
        <Link href="/quizzes" className="text-blue-600 font-medium hover:underline">Quay lại danh sách luyện tập</Link>
      </div>
    );
  }

  // Chuyển component quản lý State sang Client
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <InteractiveQuizClient lesson={lesson} questions={questions} />
    </div>
  );
}
