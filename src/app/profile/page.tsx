import { Trophy, Star, Medal, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cố gắng lấy Schema tự động tạo từ Trigger khi đăng ký
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userStats = {
    name: user.user_metadata?.full_name || profile?.full_name || user.email?.split("@")[0] || "Tín Hữu Mới",
    avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    level: profile?.level || 1,
    xp: profile?.total_xp || 0,
    nextLevelXp: (profile?.level || 1) * 500,
    streak: 1, // Logic cố định tạm thời
    joinedDate: new Date(user.created_at).toLocaleDateString("vi-VN")
  };

  const badges = [
    { id: "b1", name: "Khởi Đầu", description: "Hoàn thành bài học đầu tiên", icon: "🌱", earned: userStats.xp > 0 },
    { id: "b2", name: "Chăm Chỉ", description: "Học liên tục 7 ngày", icon: "🔥", earned: false },
    { id: "b3", name: "Cựu Ước", description: "Hoàn thành toàn bộ phần Cựu Ước", icon: "📜", earned: false },
    { id: "b4", name: "Tuyệt Đối", description: "Đạt 100% điểm một bài Quiz", icon: "⭐", earned: false },
  ];

  const progressPercent = Math.min((userStats.xp / userStats.nextLevelXp) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex-shrink-0 relative z-10">
          <img src={userStats.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2 truncate" title={userStats.name}>{userStats.name}</h1>
          <p className="text-gray-500 mb-4 font-medium flex items-center justify-center md:justify-start gap-2">
             <span>📧 {user.email}</span>
             <span className="text-gray-300">|</span>
             <span>⏱️ Tham gia: {userStats.joinedDate}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center md:justify-start mt-2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-sm">
              <Flame className="w-5 h-5 fill-current" /> Chuỗi {userStats.streak} ngày
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm">
              <Trophy className="w-5 h-5 fill-current" /> Hạng Đồng
            </div>
            <div className="ml-auto mt-4 sm:mt-0">
               <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Level and XP */}
        <div className="col-span-1 border border-gray-100 bg-white rounded-3xl p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-serif">
            <Star className="text-blue-600 w-6 h-6" /> Điểm Kinh Nghiệm
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-blue-100 flex flex-col items-center justify-center bg-blue-50 text-blue-700 relative shadow-inner">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-500">Cấp Độ</span>
              <span className="text-5xl font-black leading-none mt-1">{userStats.level}</span>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm font-bold text-gray-600 px-1">
            <span>{userStats.xp} XP</span>
            <span>{userStats.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 text-center font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
            Cần tích lũy thêm <span className="font-bold text-blue-600">{userStats.nextLevelXp - userStats.xp} XP</span> nữa để thăng cấp.
          </p>
        </div>

        {/* Badges Collection */}
        <div className="col-span-1 md:col-span-2 border border-gray-100 bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-serif">
            <Medal className="text-yellow-600 w-6 h-6" /> Huy Hiệu Đạt Được
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`flex flex-col items-center justify-center text-center p-5 rounded-2xl border-2 transition duration-300 ${
                  badge.earned 
                    ? "border-yellow-200 bg-gradient-to-b from-yellow-50 to-white hover:shadow-md hover:-translate-y-1" 
                    : "border-gray-100 bg-gray-50 opacity-50 grayscale hover:grayscale-0"
                }`}
              >
                <div className="text-5xl mb-4 drop-shadow-sm">{badge.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 mb-2 leading-tight">{badge.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{badge.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm text-center font-medium flex items-center justify-center gap-2 bg-blue-50 py-3 rounded-xl border border-blue-100 text-blue-800">
              💡 Làm bài kiểm tra và hoàn thành các khóa học để sưu tập thêm huy hiệu!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
