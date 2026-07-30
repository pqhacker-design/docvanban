import React, { useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { VOICE_CATALOG, LANGUAGES_LIST } from '../../data/voices';
import { VoiceOption, Gender, ProviderType, RegionTag } from '../../types';
import { Mic, Check, Play, User, Globe, Sparkles, Filter, MapPin, Loader2 } from 'lucide-react';

export const VoiceSelector: React.FC = () => {
  const { selectedVoice, setSelectedVoice, showToast, settings, playAudio } = useTTS();

  const [selectedLang, setSelectedLang] = useState<string>('vi-VN');
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionTag | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | 'all'>('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  const filteredVoices = VOICE_CATALOG.filter((voice) => {
    if (selectedLang !== 'all' && voice.languageCode !== selectedLang) return false;
    if (selectedGender !== 'all' && voice.gender !== selectedGender) return false;
    if (selectedRegion !== 'all' && voice.region !== selectedRegion) return false;
    if (selectedProvider !== 'all' && voice.provider !== selectedProvider) return false;
    return true;
  });

  const handleSelectVoice = (voice: VoiceOption) => {
    setSelectedVoice(voice);
    showToast(`Đã chọn giọng đọc: ${voice.displayName}`, 'info');
  };

  const handlePlayPreview = async (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();
    
    const textToSpeak = voice.sampleText || (
      voice.languageCode.startsWith('vi')
        ? `Xin chào! Tôi là ${voice.name}, giọng đọc AI chất lượng cao.`
        : `Hello! I am ${voice.name}, a natural AI voice.`
    );

    setPreviewingVoiceId(voice.id);

    // Option A: If user has Gemini API Key, generate real AI preview sample!
    if (settings.geminiApiKey && voice.provider === 'gemini') {
      try {
        showToast(`Đang sinh mẫu thử giọng đọc AI ${voice.name}...`, 'info');
        const response = await fetch('/api/tts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            voiceId: voice.id,
            apiKey: settings.geminiApiKey,
            provider: 'gemini'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audioBase64) {
            const { pcmToWavBlob, base64ToBlobUrl } = await import('../../lib/utils');
            let blob: Blob;
            if (data.mimeType?.includes('pcm') || data.mimeType?.includes('wav')) {
              blob = pcmToWavBlob(data.audioBase64, 24000);
            } else {
              const url = base64ToBlobUrl(data.audioBase64, data.mimeType || 'audio/wav');
              const res = await fetch(url);
              blob = await res.blob();
            }
            const audioUrl = URL.createObjectURL(blob);
            playAudio(audioUrl, `Mẫu thử: ${voice.displayName}`, blob);
            setPreviewingVoiceId(null);
            return;
          }
        }
      } catch (err) {
        console.warn('Real AI preview failed, falling back to Web Speech Synthesis', err);
      }
    }

    // Option B: Web Speech Synthesis with Pitch & Gender Tuning fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      showToast(`Đang phát mẫu đọc thử: ${voice.name}`, 'info');

      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.lang = voice.languageCode;

      // Adjust pitch & speed according to gender & voice style
      if (voice.gender === 'female') {
        u.pitch = 1.45; // Distinct higher female pitch
        u.rate = 1.05;
      } else if (voice.gender === 'male') {
        u.pitch = 0.75; // Distinct lower male pitch
        u.rate = 0.95;
      } else {
        u.pitch = 1.0;
        u.rate = 1.0;
      }

      // Try matching browser voices
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => 
        v.lang.startsWith('vi') && 
        (voice.gender === 'female' ? /female|nu|thuy|mai|huong|dung|lan/i.test(v.name) : /male|nam|thanh|minh|huy/i.test(v.name))
      ) || voices.find(v => v.lang.startsWith('vi'));

      if (viVoice) u.voice = viVoice;

      u.onend = () => setPreviewingVoiceId(null);
      u.onerror = () => setPreviewingVoiceId(null);

      window.speechSynthesis.speak(u);
    } else {
      setPreviewingVoiceId(null);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      {/* Title & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-base">Chọn giọng đọc AI</h3>
        </div>

        {/* Selected Count */}
        <span className="text-xs text-slate-400 font-medium">
          Hiển thị <strong className="text-teal-300 font-semibold">{filteredVoices.length}</strong> giọng đọc
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Language Select */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-teal-400" /> Ngôn ngữ
          </label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất cả ngôn ngữ</option>
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-400" /> Vùng miền
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as RegionTag | 'all')}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất cả vùng miền</option>
            <option value="Miền Bắc">Miền Bắc (Hà Nội)</option>
            <option value="Miền Trung">Miền Trung (Huế/Đà Nẵng)</option>
            <option value="Miền Nam">Miền Nam (Sài Gòn)</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3 text-teal-400" /> Giới tính
          </label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as Gender | 'all')}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="female">Nữ (Female)</option>
            <option value="male">Nam (Male)</option>
            <option value="neutral">Trung tính</option>
          </select>
        </div>

        {/* Provider Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-teal-400" /> Nhà cung cấp
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as ProviderType | 'all')}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất cả Provider</option>
            <option value="gemini">Google Gemini AI</option>
            <option value="webspeech">Web Speech (Offline)</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="openai">OpenAI TTS</option>
          </select>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {filteredVoices.map((voice) => {
          const isSelected = selectedVoice.id === voice.id;
          const isPreviewing = previewingVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => handleSelectVoice(voice)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-teal-950/40 border-teal-500/80 ring-1 ring-teal-500/50 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      voice.gender === 'female'
                        ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {voice.gender === 'female' ? 'Nữ' : 'Nam'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-xs flex items-center gap-1.5">
                      {voice.displayName}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>{voice.languageName}</span>
                      {voice.region && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800/60 font-medium">
                          {voice.region}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Selected Checkmark or Preview button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handlePlayPreview(e, voice)}
                    disabled={isPreviewing}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white transition-all text-xs disabled:opacity-50"
                    title="Nghe thử bài mẫu"
                  >
                    {isPreviewing ? (
                      <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                  </button>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {voice.description && (
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {voice.description}
                </p>
              )}

              {/* Tags & Provider Pill */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-800/60">
                <div className="flex flex-wrap gap-1">
                  {voice.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold text-teal-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {voice.provider}
                </span>
              </div>
            </div>
          );
        })}

        {filteredVoices.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 text-xs space-y-2">
            <p>Không tìm thấy giọng đọc phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSelectedLang('all');
                setSelectedRegion('all');
                setSelectedGender('all');
                setSelectedProvider('all');
              }}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg font-medium"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
