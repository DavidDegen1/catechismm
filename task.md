Lộ trình Phát triển App Học Giáo Lý
1. Khởi tạo nền tảng (Foundation & Setup)
 Khởi tạo dự án Next.js trắng với TypeScript và Tailwind CSS.
 Thiết lập cấu trúc thư mục (components, app, lib, utils).
 Tạo Navbar, Footer và các Layout cơ bản.
 Thiết lập và tích hợp Supabase Authentication (Đăng nhập - Chờ nhập key API).
2. Trải nghiệm Học tập Cốt lõi (Lectio Divina & Gamification)
 [x] Hiển thị Daily Streak (chuỗi ngày học) để tạo động lực vi mô.
 [x] Thiết kế UI bài học với cấu trúc 4 phần mượt mà: Đọc - Suy ngẫm - Cầu nguyện - Hành động.
 [x] Tích hợp Audio Player cao cấp: Chỉnh tốc độ (1x, 1.5x), hỗ trợ bật/tắt nhạc nền (Ambient sounds), thu nhỏ chạy ngầm.
 [x] Tính năng tương tác văn bản: Pop-up giải nghĩa từ vựng khó (Interactive Glossary), Highlight bôi đen và Bookmark.
 [x] Tích hợp ô nhập "Sổ tay thiêng liêng" ngay dưới phần "Suy ngẫm".
3. Hệ thống Trắc nghiệm (Quizzes)
 Thiết kế lược đồ bảng cho bộ câu hỏi và đáp án.
 Xây dựng giao diện UI cho bài kiểm tra trắc nghiệm.
 Cài đặt logic chấm điểm và hiển thị kết quả.
4. Trò chơi hóa (Gamification)
 Thiết kế hệ thống tính toán điểm XP và Level.
 Thiết kế và lưu trữ các Huy hiệu (Badges).
 Trang Hồ sơ người dùng hiển thị chứng nhận và các huy hiệu.
5. Góc Suy Niệm & Dụ Ngôn
 Xây dựng UI danh sách phân tích Dụ ngôn thời nay.
 Giao diện bài viết diễn giải Dụ ngôn liên kết đời sống.
 Chức năng "Sổ tay thiêng liêng" (Viết nhật ký cá nhân).
6. Tích hợp Database Thực (Supabase)
 Kết nối trang Danh sách bài học (Lessons) bằng dữ liệu DB.
 Kết nối trang Chi tiết Bài học & Trắc nghiệm báo cáo lên DB.
 Ghi đè chức năng Auth luồng Đăng ký/Đăng nhập thật sự.
 Hiệu chỉnh Sổ tay thiêng liêng và góc Suy niệm lưu DB.
7. Tích hợp Trợ lý AI (QA Chat)
 Thiết lập Vector DB và nạp nguồn tài liệu chuẩn xác.
 Xây dựng UI Chatbot bong bóng.
 Cài đặt Gemini API/OpenAI kết hợp hạn chế ngữ cảnh tránh hallucination.
8. Đánh bóng & Triển khai (Polish & Deploy)
 Review và tối ưu hóa hiệu ứng chuyển động, màu sắc.
 Tối ưu hình ảnh, lazy loading và SEO.
 Cấu hình biến môi trường Production.
 Xuất bản (Deploy) lên Vercel.

users: ID, Name, Email, Avatar URL, XP, Level.
lessons: ID, Title, Content, Audio_URL, Category, Sort_Order.
quizzes: ID, Lesson_ID, Question, Options (JSON), Correct_Option, Explanation.
user_progress: User_ID, Lesson_ID, Status, Quiz_Score, Completed_At.
badges: ID, Name, Description, Icon_URL, Condition_To_Unlock.
user_badges: User_ID, Badge_ID, Earned_At.
reflections: ID, User_ID, Parable_ID, Content, Created_At.
Các Chức năng Cốt lõi
Quản lý Bài học: Bài học theo mô hình Micro-learning (Đọc ngắn, Suy, Cầu, Hành). Audio song song với văn bản, có thể thêm nhạc thiền. Bấm vào từ vựng khó để xem giải thích trực tiếp (Glossary).
Trắc nghiệm & Tính điểm (Gamification): Người dùng làm bài sau mỗi phần học để kiếm XP. Nhận huy hiệu khi đạt mốc nhất định.
Góc Dụ Ngôn (Thực tế hóa): Kết nối dụ ngôn với bối cảnh thực tại. Sổ tay để người học tĩnh tâm ghi chép riêng tư.
Chatbot Kiến thức: Bot AI trả lời nghiêm túc các thắc mắc về đức tin và giải thích dựa trên kho tài liệu đã cung cấp.
Kế hoạch Kiểm thử & Triển khai
Vercel: Gắn Git để tự động build Production sau mỗi khi push code lên nhánh chính.
Về UI/UX: Màu sắc cần sáng sủa, nghiêm trang nhưng thân thiện (Ví dụ: Vàng nhạt, trắng, nhấn bằng đỏ/xanh thanh lịch). Font chữ hiển thị rõ lớn để dễ theo dõi.
Mobile First: Ứng dụng tập trung vào bản web (Responsive) thay vì đóng gói App Store phức tạp ngay lập tức.