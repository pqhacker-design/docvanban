import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TextChunk } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format seconds into MM:SS or HH:MM:SS
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format file size in KB or MB
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Estimate reading duration based on character & word count and playback speed
export function estimateReadingTime(text: string, speed = 1.0): { seconds: number; formatted: string } {
  if (!text || text.trim().length === 0) {
    return { seconds: 0, formatted: '0s' };
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Average reading rate: ~150 words per minute (~2.5 words per second)
  const baseSeconds = words / 2.5;
  const adjustedSeconds = Math.max(1, Math.round(baseSeconds / Math.max(0.2, speed)));
  
  return {
    seconds: adjustedSeconds,
    formatted: formatTime(adjustedSeconds)
  };
}

// Split long text into smart semantic chunks by sentence/paragraph
export function splitTextIntoChunks(text: string, maxCharsPerChunk = 500): TextChunk[] {
  const clean = text.trim();
  if (!clean) return [];

  if (clean.length <= maxCharsPerChunk) {
    return [
      {
        id: 'chunk-1',
        index: 0,
        text: clean,
        characterCount: clean.length,
        wordCount: clean.split(/\s+/).length,
        status: 'pending'
      }
    ];
  }

  // Split by paragraphs first
  const paragraphs = clean.split(/\n+/);
  const rawChunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedPara = paragraph.trim();
    if (!trimmedPara) continue;

    if ((currentChunk + '\n' + trimmedPara).length <= maxCharsPerChunk) {
      currentChunk = currentChunk ? currentChunk + '\n' + trimmedPara : trimmedPara;
    } else {
      if (currentChunk) rawChunks.push(currentChunk);

      // If single paragraph is longer than maxCharsPerChunk, split by sentences (. ! ? ;)
      if (trimmedPara.length > maxCharsPerChunk) {
        const sentences = trimmedPara.match(/[^.!?;\n]+[.!?;\n]+/g) || [trimmedPara];
        let subChunk = '';

        for (const sentence of sentences) {
          if ((subChunk + ' ' + sentence).length <= maxCharsPerChunk) {
            subChunk = subChunk ? subChunk + ' ' + sentence : sentence;
          } else {
            if (subChunk) rawChunks.push(subChunk.trim());
            
            // If single sentence is still huge, chunk by word boundary
            if (sentence.length > maxCharsPerChunk) {
              const words = sentence.split(' ');
              let wordChunk = '';
              for (const word of words) {
                if ((wordChunk + ' ' + word).length <= maxCharsPerChunk) {
                  wordChunk = wordChunk ? wordChunk + ' ' + word : word;
                } else {
                  if (wordChunk) rawChunks.push(wordChunk.trim());
                  wordChunk = word;
                }
              }
              if (wordChunk) subChunk = wordChunk;
            } else {
              subChunk = sentence;
            }
          }
        }
        if (subChunk) rawChunks.push(subChunk.trim());
        currentChunk = '';
      } else {
        currentChunk = trimmedPara;
      }
    }
  }

  if (currentChunk) {
    rawChunks.push(currentChunk);
  }

  return rawChunks.map((chunkText, idx) => ({
    id: `chunk-${idx + 1}`,
    index: idx,
    text: chunkText,
    characterCount: chunkText.length,
    wordCount: chunkText.split(/\s+/).filter(Boolean).length,
    status: 'pending'
  }));
}

// Convert Base64 string to Blob URL
export function base64ToBlobUrl(base64: string, mimeType = 'audio/mp3'): string {
  try {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Failed to convert base64 to blob url', e);
    return '';
  }
}

// Convert Raw PCM 16-bit 24kHz LE data from Gemini TTS to valid WAV file with RIFF header
export function pcmToWavBlob(pcmBase64: string, sampleRate = 24000, numChannels = 1): Blob {
  const cleanBase64 = pcmBase64.includes(',') ? pcmBase64.split(',')[1] : pcmBase64;
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const pcmBuffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmBuffer[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true);  // SampleRate
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, len, true); // SubChunk2Size

  const wavBlob = new Blob([wavHeader, pcmBuffer], { type: 'audio/wav' });
  return wavBlob;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Stitch multiple WAV or Audio base64 chunks into a combined audio blob
export async function concatenateAudioBlobs(blobs: Blob[], mimeType = 'audio/wav'): Promise<Blob> {
  if (blobs.length === 0) return new Blob([], { type: mimeType });
  if (blobs.length === 1) return blobs[0];

  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audioBuffers: AudioBuffer[] = [];

    for (const blob of blobs) {
      const arrayBuffer = await blob.arrayBuffer();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      audioBuffers.push(decoded);
    }

    const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.length, 0);
    const numberOfChannels = audioBuffers[0].numberOfChannels;
    const sampleRate = audioBuffers[0].sampleRate;

    const outBuffer = audioCtx.createBuffer(numberOfChannels, totalLength, sampleRate);

    for (let channel = 0; channel < numberOfChannels; channel++) {
      let offset = 0;
      const channelData = outBuffer.getChannelData(channel);
      for (const buf of audioBuffers) {
        channelData.set(buf.getChannelData(Math.min(channel, buf.numberOfChannels - 1)), offset);
        offset += buf.length;
      }
    }

    return audioBufferToWavBlob(outBuffer);
  } catch (e) {
    console.warn('AudioContext concatenation failed, falling back to blob concatenation', e);
    return new Blob(blobs, { type: mimeType });
  }
}

// Convert AudioBuffer to WAV Blob
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const result = new Float32Array(buffer.length * numChannels);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      result[i * numChannels + channel] = channelData[i];
    }
  }

  const dataLength = result.length * 2;
  const bufferArray = new ArrayBuffer(44 + dataLength);
  const view = new DataView(bufferArray);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([bufferArray], { type: 'audio/wav' });
}

// Generate realistic dummy waveform points (0..100) for visual representation
export function generateWaveformData(points = 60): number[] {
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    // Generate organic wave shape
    const value = Math.round(20 + Math.sin(i * 0.2) * 30 + Math.random() * 45);
    data.push(Math.min(100, Math.max(10, value)));
  }
  return data;
}
