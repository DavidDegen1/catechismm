import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Phân tích URL để lấy Search Params do Supabase gửi về sau khi xác thực
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // URL để redirect người dùng về sau khi login thành công
  // Ví dụ: site.com/auth/callback?code=xxxx&next=/lessons
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // Đổi Auth Code lấy Session (Cookie) lưu trữ trên trình duyệt
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Thành công, điều hướng về đích
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // Nếu thất bại hoặc không có Code, đưa người dùng về Dashboard kèm mã lỗi Error
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Lỗi xác thực Google. Vui lòng thử lại!`)
}
