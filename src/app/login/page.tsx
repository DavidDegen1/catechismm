"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Tách nhỏ phần Content chứa Search Params để có thể gói bằng thẻ Suspense của React 18+ (Tránh lỗi Build Nextjs)
function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vui lòng điền đầy đủ Email và Mật khẩu");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        // Đăng ký mở tài khoản
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: email.split("@")[0], // Mock name từ email
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            }
          }
        });
        
        if (error) throw error;
        setErrorMsg("Đăng ký thành công! Vui lòng kiểm tra hộp thư Email để xác thực.");
        // Chuyển sang khung Đăng nhập lại
        setIsSignUp(false);
        setPassword("");
        
      } else {
        // Đăng nhập
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        // Redirect về Dashboard / Reload Navbar Layout state
        window.location.href = "/profile";
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xảy ra lỗi trong quá trình xác thực");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row relative z-10 mx-auto mt-10 min-h-[600px]">
      {/* Left Side: Branding & Info */}
      <div className="md:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 mb-16 hover:text-white transition group focus:outline-none focus:ring-2 focus:ring-white">
            <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Về trang chủ
          </Link>
          
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            Bắt đầu hành trình <br/><span className="text-blue-200">Đức Tin</span> của bạn
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-sm">
            Đăng nhập để lưu tiến độ Bài Giảng, tham gia các bộ Trắc Nghiệm, tích lũy XP và viết trang Sổ Tay thiêng liêng.
          </p>
        </div>
        
        <div className="mt-12">
          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <span className="text-3xl">🕊️</span>
            <div>
              <p className="font-bold text-sm">Học Giáo Lý Công Giáo</p>
              <p className="text-xs text-blue-200">Ứng dụng trực tuyến cá nhân</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Tạo Tài Khoản Mới" : "Chào mừng quay lại!"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isSignUp 
              ? "Gia nhập để tiếp cận khóa học miễn phí." 
              : "Vui lòng đăng nhập vào tài khoản của bạn để tiếp tục."}
          </p>

          {(errorMsg || urlError) && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium border flex items-start gap-2 ${errorMsg.includes('thành công') ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-100"}`}>
               <span className="mt-0.5">{errorMsg.includes('thành công') ? "✅" : "⚠️"}</span> 
               <span>{errorMsg || urlError}</span>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-sans focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isGoogleLoading ? "Đang kết nối..." : "Đăng nhập với Google (Khuyên dùng)"}
          </button>

          <div className="flex items-center my-8 text-gray-400">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm bg-white font-medium">Hoặc dùng Email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-sm"
                  placeholder="nguyenvana@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              {!isSignUp && (
                 <div className="text-right mt-3 mb-2">
                   <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">Quên mật khẩu?</a>
                 </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4 outline-none focus:ring-4 focus:ring-blue-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Lập Tài Khoản Mới" : "Đăng Nhập Quản Lý")}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-10 font-medium border-t border-gray-100 pt-6">
            {isSignUp ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(""); }}
              className="text-blue-600 font-bold hover:text-blue-800 transition px-2 py-1 relative focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md bg-blue-50 ml-1"
            >
              {isSignUp ? "Đăng nhập ngay" : "Tạo tài khoản miễn phí"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Hàm Wrapper chính bọc Suspense Context
export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>

      <Suspense fallback={
        <div className="w-full max-w-5xl h-[600px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center justify-center relative z-10 mx-auto mt-10">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Đang tải biểu mẫu xác thực...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

// Icon helper components
function ChevronLeftIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
