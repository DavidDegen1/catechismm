export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  lessonId: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  readContent?: string;
  reflectQuestion?: string;
  prayContent?: string;
  actContent?: string;
  category: "Cựu Ước" | "Tân Ước" | "Phụng Vụ" | "Luân Lý";
  duration: number; // in minutes
  imageUrl?: string;
  audioUrl?: string;
  ambientSoundUrl?: string;
  isUnlocked: boolean;
};

export type Glossary = {
  id: string;
  term: string;
  definition: string;
  relatedLessonId: string | null;
};

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "l1_sangthe_1",
    title: "Chương 1: Công Trình Sáng Tạo",
    description: "Khám phá khởi đầu của vạn vật và tình yêu của Thiên Chúa qua 7 ngày.",
    readContent: "Lúc khởi đầu, trời đất trống không và tăm tối. Thiên Chúa phán: \"Hãy có ánh sáng.\" Và liền có ánh sáng. Đó là khởi đầu của vạn vật. Thiên Chúa tạo dựng muôn loài muôn vật trong 6 ngày, và chọn ngày thứ 7 để nghỉ ngơi. Sự sáng tạo vạn hữu là minh chứng đầu tiên cho Tình Yêu trọn vẹn của Thiên Chúa đối với con người.",
    reflectQuestion: "Bạn thấy tình yêu và sự vĩ đại của Thiên Chúa hiện diện thế nào trong vũ trụ xung quanh mình?",
    prayContent: "Lạy Chúa, xin cho con biết tạ ơn Chúa vì vẻ đẹp thiên nhiên mà Ngài đã ban tặng cho chúng con. Lạy Chúa, xin dạy con sống chan hoà với muôn vật.",
    actContent: "Hôm nay, hãy cắm một bông hoa trong phòng hoặc đi dạo 15 phút không dùng điện thoại để chiêm ngắm thiên nhiên.",
    category: "Cựu Ước",
    duration: 10,
    isUnlocked: true,
  },
  {
    id: "l1_sangthe_2",
    title: "Chương 2: Sa Ngã & Lời Hứa",
    description: "Nguyên tội của loài người và khát vọng cứu độ của Đức Chúa dành cho nhân loại xuất phát từ Vườn Địa Đàng.",
    readContent: "Adam và Eva đã ăn trái cấm do sự cám dỗ của con rắn. Tội lỗi bước vào thế gian, nhưng Thiên Chúa không bỏ mặc con người mà hứa ban Đấng Cứu Độ để giải thoát chúng ta khỏi sự chết.",
    reflectQuestion: "Có khi nào bạn cảm thấy mình đang trốn tránh Chúa sau khi phạm lỗi không?",
    prayContent: "Lạy Chúa, xin thương xót sự yếu đuối của con và ban cho con can đảm để quay về với Ngài. Xin tấy sạch linh hồn con.",
    actContent: "Hãy dọn mình và đi Xưng Tội trong tuần này nếu bạn thấy cần thiết.",
    category: "Cựu Ước",
    duration: 15,
    isUnlocked: true,
  },
  {
    id: "l2_tanuoc_1",
    title: "Bài 1: Truyền Tin & Giáng Sinh",
    description: "Sự vâng phục của Đức Maria và mầu nhiệm Ngôi Lời Nhập Thể làm người.",
    readContent: "Thiên Thần Gabriel hiện ra cùng sứ điệp truyền tin. Đức Maria nói tiếng \"Xin Vâng\" (Fiat). Ngôi Lời đã trở nên người phàm và cư ngụ giữa chúng ta, rạng ngời ánh sáng chân lý.",
    reflectQuestion: "Nếu Chúa gọi bạn làm một điều vượt ngoài khả năng, bạn có sẵn sàng thưa \"Xin Vâng\" như Đức Mẹ không?",
    prayContent: "Lạy Chúa, xin cho con biết lắng nghe và làm theo Thánh Ý Chúa trong mọi nẻo đường đời.",
    actContent: "Đọc 3 kinh Kính Mừng để cầu nguyện cho một người đang gặp khó khăn trong gia đình.",
    category: "Tân Ước",
    duration: 20,
    isUnlocked: false,
  },
  {
    id: "l3_phungvu_1",
    title: "Thánh Lễ: Đỉnh cao đời sống Phụng Vụ",
    description: "Hiểu sâu hơn về các phần trong Thánh Lễ, tầm quan trọng của Tiệc Thánh Thể.",
    readContent: "Thánh lễ là nguồn mạch và chóp đỉnh của đời sống Kitô hữu. Trong đó, hy lễ Thập giá được hiện tại hóa qua Bí Tích Thánh Thể thiêng liêng. Chúa Giêsu, vì yêu thương ta đã tự hiến làm Bánh Hằng Sống...",
    reflectQuestion: "Bạn thường tham dự Thánh Lễ với tâm thế nào? Có phải là một cuộc gặp gỡ hay chỉ là thói quen?",
    prayContent: "Lạy Chúa Giêsu Thánh Thể, xin cho con luôn khát khao được rước Chúa vào lòng.",
    actContent: "Chuẩn bị tâm hồn thật tốt và đi lễ sớm 5 phút vào Chủ Nhật tuần này.",
    category: "Phụng Vụ",
    duration: 25,
    isUnlocked: false,
  }
];

export const MOCK_GLOSSARIES: Glossary[] = [
  { id: "g1", term: "Ánh sáng", definition: "Không chỉ là ánh sáng vật lý, mà biểu thị cho sự sống, chân lý và chính Thiên Chúa trong sách Sáng Thế.", relatedLessonId: "l1_sangthe_1" },
  { id: "g2", term: "Nguyên tội", definition: "Tình trạng thiếu vắng ân sủng thánh hóa ban đầu, do tổ tông loài người truyền lại.", relatedLessonId: "l1_sangthe_2" },
  { id: "g3", term: "Xin Vâng", definition: "Tiếng 'Fiat' của Đức Maria, thể hiện sự vâng phục tuyệt đối vào thánh ý Thiên Chúa.", relatedLessonId: "l2_tanuoc_1" },
  { id: "g4", term: "Thánh Thể", definition: "Bí tích Mình và Máu Chúa Kitô ngự thật dưới hình bánh và rượu.", relatedLessonId: "l3_phungvu_1" }
];

export const MOCK_QUIZZES: QuizQuestion[] = [
  {
    id: "q1",
    lessonId: "l1_sangthe_1",
    question: "Thiên Chúa đã sáng tạo vũ trụ trong bao nhiêu ngày trước khi nghỉ ngơi?",
    options: [
      { id: "A", text: "3 ngày" },
      { id: "B", text: "6 ngày" },
      { id: "C", text: "7 ngày" },
      { id: "D", text: "40 ngày" }
    ],
    correctOptionId: "B",
    explanation: "Thiên Chúa sáng tạo vạn vật trong 6 ngày, và chọn ngày thứ 7 (ngày Sabát) làm ngày nghỉ ngơi thánh thiêng."
  },
  {
    id: "q2",
    lessonId: "l1_sangthe_1",
    question: "Đỉnh cao của công trình sáng tạo của Thiên Chúa là gì?",
    options: [
      { id: "A", text: "Các vì tinh tú" },
      { id: "B", text: "Các loài động vật" },
      { id: "C", text: "Thiên Thần" },
      { id: "D", text: "Con người (nam và nữ)" }
    ],
    correctOptionId: "D",
    explanation: "Sau khi sáng tạo mọi loài, Thiên Chúa mới dựng nên con người theo hình ảnh của Người. Đó là đỉnh cao của tình yêu sáng tạo."
  }
];

export type Parable = {
  id: string;
  title: string;
  biblicalReference: string;
  shortDescription: string;
  theme: string;
  likes: number;
  readTime: number; // minutes
  imageUrl?: string;
  content?: string;
};

export const MOCK_PARABLES: Parable[] = [
  {
    id: "p1_nongphu",
    title: "Người Gieo Giống Trong Thời Đại Số",
    biblicalReference: "Mt 13,1-9",
    shortDescription: "Hạt giống Lời Chúa rơi vào những 'mảnh đất' nào giữa kỷ nguyên mạng xã hội ồn ào?",
    theme: "Lắng Nghe",
    likes: 245,
    readTime: 5,
    content: "Dụ ngôn người gieo giống vẫn nguyên giá trị cho đến ngày nay. Nếu hạt giống là Lời Chúa, thì sự bận rộn, thông báo Facebook, TikTok chính là 'những bụi gai' làm nghẹt ngòi Lời Chúa trong tâm trí người trẻ hiện đại.\n\nĐôi khi chúng ta mải mê lướt xem những luồng thông tin vô thưởng vô phạt mà quên mất việc dành 5 phút trong thinh lặng để hạt giống Lời có cơ hội đâm chồi nảy lộc trong 'mảnh đất tốt' của linh hồn mình."
  },
  {
    id: "p2_nguoisamaritiano",
    title: "Người Samaritanô Nhân Hậu Đi Ngang Qua Phố",
    biblicalReference: "Lc 10,25-37",
    shortDescription: "Ai là 'người thân cận' của chúng ta trong những tòa nhà chọc trời vô cảm?",
    theme: "Bác Ái",
    likes: 512,
    readTime: 6,
    content: "Trong một xã hội mà ai cũng vội vã, việc dừng lại giúp đỡ một người bị ngã ven đường đôi khi lại trở thành một quyết định đắn đo. Người ta sợ 'dây dưa', sợ bị lừa đảo.\n\nGiống như vị Tư tế hay Thầy cả Lêvi trong dụ ngôn, chúng ta bận rộn với các việc 'đạo đức' nhưng lại bỏ quên tình yêu thương đích thực. Hãy trở nên như một người Samaritanô của thời đại: chủ động bước đến, băng bó vết thương tinh thần và thể xác của những người đang cần đến ta, không phân biệt họ là ai."
  },
  {
    id: "p3_nguoichaphungpha",
    title: "Đứa Con Hoang Đàng Trở Về Nhà",
    biblicalReference: "Lc 15,11-32",
    shortDescription: "Vòng tay bao dung của Người Cha chờ đón những tâm hồn lạc lối vì áp lực hiện đại.",
    theme: "Sám Hối",
    likes: 890,
    readTime: 7,
    content: "Áp lực 'phải thành công', 'phải kiếm nhiều tiền' đã biến nhiều người thành những đứa con hoang đàng, bỏ lại gia đình và đức tin để chạy theo phù hoa. Nhưng sâu thẳm trong họ là sự cô đơn và trống rỗng.\n\nThiên Chúa không bao giờ đóng cửa. Người luôn mòn mỏi ngóng trông chúng ta trở về, sẵn sàng khoác lại cho ta tấm áo đẹp nhất của sự ân sủng, bất chấp ta đã đi xa đến mức nào."
  }
];
