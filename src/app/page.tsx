import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 font-serif">
        Hành Trình Đức Tin
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
        Ứng dụng học giáo lý tương tác với lộ trình rõ ràng, hệ thống trắc nghiệm, và tích hợp AI hỗ trợ giải đáp thắc mắc.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/lessons" 
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
        >
          Bắt đầu học ngay
        </Link>
        <Link 
          href="/(auth)/login" 
          className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-full font-medium hover:bg-blue-50 transition"
        >
          Đăng nhập
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">📖</div>
          <h3 className="text-xl font-bold mb-2">Bài học Giáo Lý</h3>
          <p className="text-gray-600">Hệ thống bài học đa dạng, kết hợp âm thanh tĩnh tâm và giao diện đọc thân thiện.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4 text-2xl">🏆</div>
          <h3 className="text-xl font-bold mb-2">Trắc nghiệm & Huy hiệu</h3>
          <p className="text-gray-600">Củng cố kiến thức bằng các bài quiz, tích lũy điểm XP và mở khóa huy hiệu thành tích.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">🤖</div>
          <h3 className="text-xl font-bold mb-2">Trợ lý AI Thông Minh</h3>
          <p className="text-gray-600">Hỏi đáp thắc mắc về đức tin, được trả lời bởi AI dựa vào dữ liệu giáo lý chuẩn mực.</p>
        </div>
      </div>
    </div>
  );
}
