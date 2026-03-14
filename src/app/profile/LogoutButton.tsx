"use client";

import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoggingOut}
      className="flex items-center gap-2 text-gray-600 font-bold bg-white border border-gray-200 hover:bg-gray-50 hover:text-red-500 px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow-md disabled:opacity-50"
    >
      {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />} 
      Đăng Xuất
    </button>
  );
}
