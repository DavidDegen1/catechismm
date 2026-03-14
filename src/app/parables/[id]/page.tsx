import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ChevronLeft, Clock, MessageCircle, Share2 } from "lucide-react";
import InteractiveParableClient from "./InteractiveParableClient";

export default async function ParableDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: parable, error } = await supabase
    .from("parables")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !parable) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết!</h2>
        <Link href="/parables" className="text-blue-600 underline">Quay lại Góc Suy Niệm</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link 
        href="/parables"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Danh sách bài viết
      </Link>

      <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decorator Block */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>

        <header className="mb-10 text-center relative z-10">
          <div className="flex justify-center flex-wrap gap-3 mb-6">
            <span className="text-sm font-bold tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">
              {parable.theme}
            </span>
            <span className="text-sm font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full uppercase">
              Trích đoạn: {parable.biblical_reference}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {parable.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {parable.read_time} phút đọc
            </span>
            <InteractiveParableClient parableId={parable.id} initialLikes={parable.likes} />
          </div>
        </header>

        {/* Lead paragraph */}
        <div className="text-xl text-gray-600 font-serif italic border-l-4 border-indigo-200 pl-6 mb-12 relative z-10">
          "{parable.short_description}"
        </div>

        {/* Main Content */}
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-serif relative z-10">
          {parable.content ? (
            parable.content.split("\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-6">{paragraph}</p>
            ))
          ) : (
             <p className="text-center text-gray-400 italic py-10">Nội dung bài viết đang được cập nhật...</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <InteractiveParableClient parableId={parable.id} initialLikes={parable.likes} isButton={true} />

          <div className="flex gap-4">
             <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
               <MessageCircle className="w-6 h-6" />
             </button>
             <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
               <Share2 className="w-6 h-6" />
             </button>
          </div>
        </div>
      </article>

      {/* Write Diary Prompt */}
      <div className="mt-12 bg-blue-50 rounded-3xl p-8 border border-blue-100 text-center">
        <h3 className="text-xl font-bold text-blue-900 mb-3">Sổ Tay Thiêng Liêng</h3>
        <p className="text-blue-700 mb-6 max-w-md mx-auto">
          Bài đọc này gợi cho bạn điều gì? Hãy ghi lại vài dòng suy nghĩ để nhìn lại chặng đường tâm linh của mình.
        </p>
        <Link 
          href={`/diary?ref=${parable.id}`}
          className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-blue-700 transition hover:shadow-lg"
        >
          Viết nhật ký ngay
        </Link>
      </div>

    </div>
  );
}
