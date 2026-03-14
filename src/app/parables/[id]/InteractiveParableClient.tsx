"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";

export default function InteractiveParableClient({ 
  parableId, 
  initialLikes,
  isButton = false
}: { 
  parableId: string, 
  initialLikes: number,
  isButton?: boolean
}) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newScore = isLiked ? likesCount - 1 : likesCount + 1;
      setLikesCount(newScore);
      setIsLiked(!isLiked);

      // Cập nhật lên CSDL Supabase
      await supabase
        .from('parables')
        .update({ likes: newScore })
        .eq('id', parableId);

    } catch (e) {
      console.error("Lỗi khi cập nhật lượt thích", e);
      // Revert if error
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      setIsLiked(!isLiked);
    } finally {
      setIsLoading(false);
    }
  };

  if (isButton) {
    return (
      <button 
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
           "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm border",
           isLiked 
             ? "bg-red-50 text-red-600 border-red-200" 
             : "bg-white text-gray-700 hover:bg-gray-50 hover:text-red-500 border-gray-200",
           isLoading && "opacity-70 cursor-wait"
        )}
      >
        <Heart className={cn("w-6 h-6 transition-transform", isLiked && "fill-current scale-110")} />
        {isLiked ? "Đã thích bài viết" : "Thích bài viết"}
      </button>
    );
  }

  return (
    <button 
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1.5 transition-colors group",
        isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
      )}
    >
      <Heart className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isLiked && "fill-current")} /> 
      {likesCount} lượt thích
    </button>
  );
}
