-- SƠ ĐỒ CƠ SỞ DỮ LIỆU APP HỌC GIÁO LÝ (Dành cho Supabase SQL Editor)
-- Copy toàn bộ đoạn mã này dán vào màn hình SQL Editor của Supabase để khởi tạo bảng.

-- 1. Bảng Thông tin Học Viên (Kết nối với Bảng Auth.users của Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật RLS cho Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép mọi người xem profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Người dùng tự sửa profile của mình" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger tự động tạo Profile khi user đăng ký ở Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Bảng Bài Học (Lessons)
CREATE TABLE public.lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  read_content TEXT, -- Phần đọc (văn bản chính)
  reflect_question TEXT, -- Câu hỏi gợi ý suy ngẫm
  pray_content TEXT, -- Lời cầu nguyện đúc kết
  act_content TEXT, -- Hành động thực tiễn trong ngày
  category TEXT NOT NULL CHECK (category IN ('Cựu Ước', 'Tân Ước', 'Phụng Vụ', 'Luân Lý')),
  duration INTEGER DEFAULT 15, -- Số phút đọc
  is_unlocked BOOLEAN DEFAULT false,
  audio_url TEXT,
  ambient_sound_url TEXT, -- Link nhạc nền thiền/thánh ca không lời
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mọi người có thể xem Bài học" ON public.lessons FOR SELECT USING (true);

-- 2.1 Bảng Từ vựng Thần học / Giáo lý (Glossary cho Tooltips)
CREATE TABLE public.glossaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  related_lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.glossaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mọi người có thể xem Thuật ngữ" ON public.glossaries FOR SELECT USING (true);

-- 2.2 Bảng Đánh dấu & Ghi chú nhanh (Bookmarks & Highlights)
CREATE TABLE public.user_bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  highlighted_text TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Người dùng quản lý bookmark của mình" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- 3. Bảng Câu Hỏi Trắc Nghiệm (Quizzes)
CREATE TABLE public.quizzes (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Dạng mảng Object [{id: 'A', text: '...'}, ...]
  correct_option_id TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mọi người có thể xem Trắc nghiệm" ON public.quizzes FOR SELECT USING (true);

-- 4. Bảng Theo Dõi Tiến Độ Học Tập & Nhật Ký (User Progress & Diary)
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  quiz_score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Người dùng tự xem và sửa tiến độ của mình" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.diaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nhật ký là riêng tư cho mỗi user" ON public.diaries FOR ALL USING (auth.uid() = user_id);

-- 5. Bảng Dụ Ngôn (Parables)
CREATE TABLE public.parables (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  biblical_reference TEXT,
  short_description TEXT,
  theme TEXT,
  content TEXT,
  likes INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.parables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mọi người có thể xem Dụ ngôn" ON public.parables FOR SELECT USING (true);
CREATE POLICY "Mọi người có thể Like Dụ ngôn" ON public.parables FOR UPDATE USING (true); -- Cho phép Like công khai

-- NẠP DỮ LIỆU MẪU (MOCK DATA) VÀO DATABASE
INSERT INTO public.lessons (id, title, description, category, duration, is_unlocked, sort_order, read_content, reflect_question, pray_content, act_content) VALUES
('l1_sangthe_1', 'Chương 1: Công Trình Sáng Tạo', 'Khám phá khởi đầu của vạn vật và tình yêu của Thiên Chúa qua 7 ngày.', 'Cựu Ước', 10, true, 1,
 'Lúc khởi đầu, trời đất trống không và tăm tối. Thiên Chúa phán: "Hãy có ánh sáng." Và liền có ánh sáng. Đó là khởi đầu của vạn vật. Thiên Chúa tạo dựng muôn loài muôn vật trong 6 ngày, và chọn ngày thứ 7 để nghỉ ngơi.',
 'Bạn thấy tình yêu và sự vĩ đại của Thiên Chúa hiện diện thế nào trong vũ trụ xung quanh mình?',
 'Lạy Chúa, xin cho con biết tạ ơn Chúa vì vẻ đẹp thiên nhiên mà Ngài đã ban tặng cho chúng con.',
 'Hôm nay, hãy cắm một bông hoa trong phòng hoặc đi dạo 15 phút không dùng điện thoại để chiêm ngắm thiên nhiên.'),
('l1_sangthe_2', 'Chương 2: Sa Ngã & Lời Hứa', 'Nguyên tội và khát vọng cứu độ của Đức Chúa.', 'Cựu Ước', 15, true, 2,
 'Adam và Eva đã ăn trái cấm do sự cám dỗ của con rắn. Tội lỗi bước vào thế gian, nhưng Thiên Chúa không bỏ mặc con người mà hứa ban Đấng Cứu Độ để giải thoát chúng ta.',
 'Có khi nào bạn cảm thấy mình đang trốn tránh Chúa sau khi phạm lỗi không?',
 'Lạy Chúa, xin thương xót sự yếu đuối của con và ban cho con can đảm để quay về với Ngài.',
 'Hãy dọn mình và đi Xưng Tội trong tuần này nếu bạn thấy cần thiết.'),
('l2_tanuoc_1', 'Bài 1: Truyền Tin & Giáng Sinh', 'Sự vâng phục của Đức Maria và mầu nhiệm Ngôi Lời.', 'Tân Ước', 20, false, 3,
 'Thiên Thần Gabriel hiện ra cùng sứ điệp truyền tin. Đức Maria nói tiếng "Xin Vâng" (Fiat). Ngôi Lời đã trở nên người phàm và cư ngụ giữa chúng ta.',
 'Nếu Chúa gọi bạn làm một điều vượt ngoài khả năng, bạn có sẵn sàng thưa "Xin Vâng" như Đức Mẹ không?',
 'Lạy Chúa, xin cho con biết lắng nghe và làm theo Thánh Ý Chúa trong mọi nẻo đường đời.',
 'Đọc 3 kinh Kính Mừng để cầu nguyện cho một người đang gặp khó khăn trong gia đình.');

INSERT INTO public.glossaries (term, definition, related_lesson_id) VALUES
('Ánh sáng', 'Không chỉ là ánh sáng vật lý, mà biểu thị cho sự sống, chân lý và chính Thiên Chúa trong sách Sáng Thế.', 'l1_sangthe_1'),
('Nguyên tội', 'Tình trạng thiếu vắng ân sủng thánh hóa ban đầu, do tổ tông loài người truyền lại.', 'l1_sangthe_2'),
('Xin Vâng', 'Tiếng "Fiat" của Đức Maria, thể hiện sự vâng phục tuyệt đối vào thánh ý Thiên Chúa.', 'l2_tanuoc_1');

INSERT INTO public.quizzes (id, lesson_id, question, options, correct_option_id, explanation) VALUES
('q1', 'l1_sangthe_1', 'Thiên Chúa đã sáng tạo vũ trụ trong bao nhiêu ngày trước khi nghỉ ngơi?', '[{"id": "A", "text": "3 ngày"}, {"id": "B", "text": "6 ngày"}, {"id": "C", "text": "7 ngày"}, {"id": "D", "text": "40 ngày"}]', 'B', 'Thiên Chúa sáng tạo vạn vật trong 6 ngày, và chọn ngày thứ 7 làm ngày nghỉ ngơi thánh thiêng.'),
('q2', 'l1_sangthe_1', 'Đỉnh cao của công trình sáng tạo của Thiên Chúa là gì?', '[{"id": "A", "text": "Các vì tinh tú"}, {"id": "B", "text": "Các loài động vật"}, {"id": "C", "text": "Thiên Thần"}, {"id": "D", "text": "Con người (nam và nữ)"}]', 'D', 'Sau khi sáng tạo mọi loài, Thiên Chúa mới dựng nên con người theo hình ảnh của Người. Đó là đỉnh cao của tình yêu sáng tạo.');

INSERT INTO public.parables (id, title, biblical_reference, short_description, theme, likes, read_time) VALUES
('p1_nongphu', 'Người Gieo Giống Trong Thời Đại Số', 'Mt 13,1-9', 'Hạt giống Lời Chúa rơi vào những "mảnh đất" nào giữa kỷ nguyên mạng xã hội ồn ào?', 'Lắng Nghe', 245, 5),
('p2_nguoisamaritiano', 'Người Samaritanô Nhân Hậu Đi Ngang Qua Phố', 'Lc 10,25-37', 'Ai là "người thân cận" của chúng ta trong những tòa nhà chọc trời vô cảm?', 'Bác Ái', 512, 6);
