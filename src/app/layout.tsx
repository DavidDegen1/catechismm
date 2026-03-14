import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "App Học Giáo Lý | Hành Trình Đức Tin",
  description: "Ứng dụng học giáo lý tương tác, trắc nghiệm và hỏi đáp AI.",
};

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-slate-50 min-h-screen flex flex-col`}>
        {/* Navbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🕊️</span>
                <span className="font-serif font-bold text-xl text-blue-900">Giáo Lý App</span>
              </Link>
              <nav className="hidden md:flex gap-8 items-center">
                <Link href="/lessons" className="text-gray-600 hover:text-blue-600 font-medium">Bài Học</Link>
                <Link href="/quizzes" className="text-gray-600 hover:text-blue-600 font-medium">Luyện Tập</Link>
                <Link href="/parables" className="text-gray-600 hover:text-blue-600 font-medium">Suy Niệm</Link>
                <Link href="/diary" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                  ✍️ Sổ Tay
                </Link>
                <Link href="/profile" className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                  ⭐ Hồ Sơ
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                {user ? (
                   <Link href="/profile" className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition truncate max-w-[200px]">
                     <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-7 h-7 rounded-full bg-white" />
                     <span className="font-bold text-blue-800 text-sm truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                   </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium hidden md:block">
                      Đăng Nhập
                    </Link>
                    <Link href="/login" className="bg-blue-600 text-white px-5 py-2.5 flex items-center rounded-full font-bold hover:bg-blue-700 transition shadow-sm hover:shadow-md hover:-translate-y-0.5">
                      Bắt Đầu ngay
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Ứng dụng Học Giáo Lý Công Giáo.</p>
            <p className="text-sm mt-2">Được thiết kế với sự cẩn trọng và lòng tin.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
