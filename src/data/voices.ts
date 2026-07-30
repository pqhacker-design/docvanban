import { VoiceOption, ProviderInfo } from '../types';

export const PROVIDERS_LIST: ProviderInfo[] = [
  {
    id: 'gemini',
    name: 'Google Gemini 3.1 TTS',
    description: 'Giọng nói AI tự nhiên nhất từ Google Gemini với biểu cảm chân thực và tốc độ đáp ứng cao.',
    requiresApiKey: true,
    keyName: 'GEMINI_API_KEY',
    supportedFormats: ['wav', 'mp3', 'aac', 'ogg'],
    badge: 'Khuyên dùng'
  },
  {
    id: 'webspeech',
    name: 'Web Speech Synthesis',
    description: 'Giọng nói mặc định của trình duyệt, hoạt động offline 100% không cần API Key.',
    requiresApiKey: false,
    supportedFormats: ['wav', 'mp3'],
    badge: 'Offline / Miễn phí'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud Text-to-Speech',
    description: 'Hệ thống giọng đọc Wavenet và Neural2 chuyên nghiệp hàng đầu từ Google Cloud.',
    requiresApiKey: true,
    keyName: 'GOOGLE_CLOUD_API_KEY',
    supportedFormats: ['mp3', 'wav', 'ogg']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs AI Voice',
    description: 'Giọng đọc siêu cảm xúc, chuyên dụng cho sách nói, podcast và quảng cáo.',
    requiresApiKey: true,
    keyName: 'ELEVENLABS_API_KEY',
    supportedFormats: ['mp3', 'wav', 'aac']
  },
  {
    id: 'openai',
    name: 'OpenAI TTS (Alloy/Echo/Nova)',
    description: 'Giọng nói AI đa ngôn ngữ chất lượng cao từ OpenAI.',
    requiresApiKey: true,
    keyName: 'OPENAI_API_KEY',
    supportedFormats: ['mp3', 'aac', 'flac', 'wav']
  },
  {
    id: 'azure',
    name: 'Microsoft Azure Speech',
    description: 'Hệ thống Neural Voice mượt mà, hỗ trợ tốt nhất cho tiếng Việt và Châu Á.',
    requiresApiKey: true,
    keyName: 'AZURE_API_KEY',
    supportedFormats: ['mp3', 'wav']
  },
  {
    id: 'amazon-polly',
    name: 'Amazon Polly Neural',
    description: 'Giọng đọc chuẩn báo chí, thời sự và truyền thông từ AWS.',
    requiresApiKey: true,
    keyName: 'AMAZON_POLLY_KEY',
    supportedFormats: ['mp3', 'ogg']
  }
];

export const VOICE_CATALOG: VoiceOption[] = [
  // Vietnamese Gemini AI Voices with authentic Vietnamese Names & Regions
  {
    id: 'gemini-Thuy',
    name: 'Cô Thúy',
    displayName: 'Cô Thúy (Giọng Nữ Bắc - Truyền cảm)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'gemini',
    region: 'Miền Bắc',
    sampleText: 'Xin chào! Tôi là Cô Thúy, giọng đọc nữ Hà Nội truyền cảm, dịu dàng và ấm áp.',
    description: 'Giọng nữ chuẩn Hà Nội, trong trẻo, tự nhiên, biểu cảm sâu lắng phù hợp sách nói và mảng văn học.',
    tags: ['Miền Bắc', 'Nữ truyền cảm', 'Sách nói', 'Podcast']
  },
  {
    id: 'gemini-Thanh',
    name: 'Thầy Thành',
    displayName: 'Thầy Thành (Giọng Nam Bắc - Trang trọng)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'male',
    provider: 'gemini',
    region: 'Miền Bắc',
    sampleText: 'Xin chào! Tôi là Thầy Thành, phát thanh viên giọng nam Hà Nội trang trọng và chuẩn tin tức.',
    description: 'Giọng nam chuẩn thủ đô, chất giọng vang, dứt khoát, chuẩn phong cách thời sự và báo chí.',
    tags: ['Miền Bắc', 'Nam thời sự', 'Tin tức', 'Bài giảng']
  },
  {
    id: 'gemini-Mai',
    name: 'Cô Mai',
    displayName: 'Cô Mai (Giọng Nữ Nam - Ngọt ngào)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'gemini',
    region: 'Miền Nam',
    sampleText: 'Xin chào các bạn! Tôi là Cô Mai, giọng đọc nữ TP. Hồ Chí Minh ngọt ngào và tươi sáng.',
    description: 'Giọng nữ Sài Gòn ngọt ngào, nhịp điệu nhanh nhạy, tự nhiên, rất thích hợp cho quảng cáo và truyện ngắn.',
    tags: ['Miền Nam', 'Nữ ngọt ngào', 'Quảng cáo', 'Giao tiếp']
  },
  {
    id: 'gemini-Nam',
    name: 'Thầy Nam',
    displayName: 'Thầy Nam (Giọng Nam Nam - Trầm ấm)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'male',
    provider: 'gemini',
    region: 'Miền Nam',
    sampleText: 'Xin chào mọi người! Tôi là Thầy Nam, giọng đọc nam miền Nam trầm ấm và hiện đại.',
    description: 'Giọng nam miền Nam hiện đại, trầm lắng, phát âm rõ từ, thích hợp thuyết minh phim và video công nghệ.',
    tags: ['Miền Nam', 'Nam trầm ấm', 'Thuyết minh', 'Công nghệ']
  },
  {
    id: 'gemini-Huong',
    name: 'Cô Hương',
    displayName: 'Cô Hương (Giọng Nữ Trung - Đằm thắm)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'gemini',
    region: 'Miền Trung',
    sampleText: 'Dạ xin chào! Tôi là Cô Hương, đại diện giọng đọc nữ miền Trung đằm thắm và giàu cảm xúc.',
    description: 'Giọng nữ Huế - Đà Nẵng thanh tao, đằm thắm, mang bản sắc văn hóa đặc trưng miền Trung.',
    tags: ['Miền Trung', 'Nữ đằm thắm', 'Văn hóa', 'Truyền cảm']
  },
  {
    id: 'gemini-Minh',
    name: 'Thầy Minh',
    displayName: 'Thầy Minh (Giọng Nam Trung - Rõ ràng)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'male',
    provider: 'gemini',
    region: 'Miền Trung',
    sampleText: 'Xin chào quý vị! Tôi là Thầy Minh, giọng đọc nam miền Trung mạnh mẽ và rõ ràng.',
    description: 'Giọng nam miền Trung dứt khoát, âm sắc khỏe khoắn, thích hợp cho tài liệu lịch sử và giáo dục.',
    tags: ['Miền Trung', 'Nam rõ ràng', 'Lịch sử', 'Tài liệu']
  },
  {
    id: 'gemini-Dung',
    name: 'Cô Dung',
    displayName: 'Cô Dung (Giọng Nữ Bắc - Sư phạm)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'gemini',
    region: 'Miền Bắc',
    sampleText: 'Thân chào các em học sinh! Tôi là Cô Dung, giọng đọc bài giảng sư phạm rõ ràng và chuẩn mực.',
    description: 'Giọng cô giáo miền Bắc truyền cảm, độ ngắt nghỉ chuẩn mực, phù hợp bài giảng trực tuyến.',
    tags: ['Miền Bắc', 'Nữ sư phạm', 'Giáo dục', 'Bài giảng']
  },
  {
    id: 'gemini-Huy',
    name: 'Anh Huy',
    displayName: 'Anh Huy (Giọng Nam Bắc - MC Event)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'male',
    provider: 'gemini',
    region: 'Miền Bắc',
    sampleText: 'Xin chào toàn thể hội nghị! Tôi là Anh Huy, MC dẫn chương trình và sự kiện chuyên nghiệp.',
    description: 'Giọng nam năng lượng cao, lôi cuốn, phù hợp giới thiệu sản phẩm và sự kiện lớn.',
    tags: ['Miền Bắc', 'Nam MC', 'Sự kiện', 'Năng lượng']
  },
  {
    id: 'gemini-Lan',
    name: 'Chị Lan',
    displayName: 'Chị Lan (Giọng Nữ Nam - MC Truyền thông)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'gemini',
    region: 'Miền Nam',
    sampleText: 'Kính chào quý vị khán giả! Tôi là Chị Lan, biên tập viên truyền thông và podcast.',
    description: 'Giọng nữ BTV miền Nam duyên dáng, gần gũi, chuyên dùng cho radio và talkshow.',
    tags: ['Miền Nam', 'Nữ BTV', 'Podcast', 'Radio']
  },

  // English Gemini Voices
  {
    id: 'gemini-en-Kore',
    name: 'Kore',
    displayName: 'English Female - Kore',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'female',
    provider: 'gemini',
    description: 'Natural American female voice, versatile and expressive.',
    tags: ['Global', 'Audiobook', 'E-learning']
  },
  {
    id: 'gemini-en-Puck',
    name: 'Puck',
    displayName: 'English Male - Puck',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'male',
    provider: 'gemini',
    description: 'Warm American male voice, smooth and engaging.',
    tags: ['Podcast', 'Narration', 'Corporate']
  },

  // Multilingual Gemini Voices
  {
    id: 'gemini-ja-Kore',
    name: 'Kore (Japanese)',
    displayName: 'Japanese Female - Kore',
    languageCode: 'ja-JP',
    languageName: 'Japanese (日本語)',
    gender: 'female',
    provider: 'gemini',
    description: 'Clear and natural Japanese female voice.',
    tags: ['Japanese', 'Anime', 'Tutorial']
  },
  {
    id: 'gemini-ko-Puck',
    name: 'Puck (Korean)',
    displayName: 'Korean Male - Puck',
    languageCode: 'ko-KR',
    languageName: 'Korean (한국어)',
    gender: 'male',
    provider: 'gemini',
    description: 'Warm and professional Korean male voice.',
    tags: ['Korean', 'K-Drama', 'News']
  },
  {
    id: 'gemini-zh-Zephyr',
    name: 'Zephyr (Mandarin)',
    displayName: 'Chinese Female - Zephyr',
    languageCode: 'zh-CN',
    languageName: 'Chinese (中文)',
    gender: 'female',
    provider: 'gemini',
    description: 'Standard Mandarin Chinese female voice.',
    tags: ['Mandarin', 'Business', 'Education']
  },
  {
    id: 'gemini-fr-Kore',
    name: 'Kore (French)',
    displayName: 'French Female - Kore',
    languageCode: 'fr-FR',
    languageName: 'French (Français)',
    gender: 'female',
    provider: 'gemini',
    description: 'Elegant Parisian French female voice.',
    tags: ['French', 'Storytelling']
  },
  {
    id: 'gemini-de-Fenrir',
    name: 'Fenrir (German)',
    displayName: 'German Male - Fenrir',
    languageCode: 'de-DE',
    languageName: 'German (Deutsch)',
    gender: 'male',
    provider: 'gemini',
    description: 'Strong and precise German male voice.',
    tags: ['German', 'Documentary']
  },

  // Web Speech Offline Voices
  {
    id: 'webspeech-vi-female',
    name: 'Browser Vi Female',
    displayName: 'Tiếng Việt - Giọng Trình Duyệt (Nữ)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'female',
    provider: 'webspeech',
    description: 'Giọng đọc Tiếng Việt có sẵn trên thiết bị của bạn.',
    tags: ['Offline', 'Nhanh chóng']
  },
  {
    id: 'webspeech-vi-male',
    name: 'Browser Vi Male',
    displayName: 'Tiếng Việt - Giọng Trình Duyệt (Nam)',
    languageCode: 'vi-VN',
    languageName: 'Tiếng Việt',
    gender: 'male',
    provider: 'webspeech',
    description: 'Giọng đọc nam Tiếng Việt tích hợp hệ điều hành.',
    tags: ['Offline', 'Nhanh chóng']
  },
  {
    id: 'webspeech-en-us',
    name: 'Browser English US',
    displayName: 'English (US) - Native Browser Voice',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'female',
    provider: 'webspeech',
    description: 'Default OS voice for American English.',
    tags: ['Offline']
  },

  // ElevenLabs Preset Voices (Mapped via Provider)
  {
    id: 'elevenlabs-21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    displayName: 'Rachel - Calm & Conversational (ElevenLabs)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'female',
    provider: 'elevenlabs',
    description: 'Calm, soothing female narrative voice.',
    tags: ['Audiobook', 'Soothing']
  },
  {
    id: 'elevenlabs-AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    displayName: 'Domi - Energetic & Strong (ElevenLabs)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'female',
    provider: 'elevenlabs',
    description: 'Strong and confident female voice.',
    tags: ['Ad', 'Promo']
  },

  // OpenAI TTS Voices
  {
    id: 'openai-alloy',
    name: 'Alloy',
    displayName: 'Alloy - Neutral & Balanced (OpenAI)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'neutral',
    provider: 'openai',
    description: 'Balanced neutral voice from OpenAI.',
    tags: ['Multi-purpose']
  },
  {
    id: 'openai-nova',
    name: 'Nova',
    displayName: 'Nova - Friendly & Bright (OpenAI)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    gender: 'female',
    provider: 'openai',
    description: 'Warm and expressive female voice from OpenAI.',
    tags: ['Warm', 'Friendly']
  }
];

export const LANGUAGES_LIST = [
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'th-TH', name: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
];
