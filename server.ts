import express, { Request, Response } from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// File Upload Config (Multer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Helper to initialize GenAI SDK
function getGenAIClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey ? customApiKey.trim() : "";
  if (!apiKey) {
    throw new Error("Chưa nhập API Key! Vui lòng nhập Gemini API Key của bạn trong phần Cài đặt để sử dụng.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Map Voice IDs to Gemini prebuilt Voice Names
function mapVoiceNameToGemini(voiceId: string): string {
  // Voice ID mappings
  if (voiceId.includes("Puck") || voiceId.includes("Thanh")) return "Puck"; // Nam trầm ấm / Thời sự
  if (voiceId.includes("Zephyr") || voiceId.includes("Mai") || voiceId.includes("Dung")) return "Zephyr"; // Nữ thanh thoát
  if (voiceId.includes("Fenrir") || voiceId.includes("Nam") || voiceId.includes("Huy")) return "Fenrir"; // Nam uy quyền / Hiện đại
  if (voiceId.includes("Charon") || voiceId.includes("Minh")) return "Charon"; // Nam dứt khoát / Khoa học
  return "Kore"; // Cô Thúy, Cô Hương, Chị Lan & default Kore
}

// ------------------- API ROUTES -------------------

// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "AI Text-to-Speech Studio Pro",
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Text Cleaner API (/api/tts/clean)
app.post("/api/tts/clean", async (req: Request, res: Response) => {
  try {
    const { text, apiKey } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Thiếu văn bản đầu vào" });
      return;
    }

    const ai = getGenAIClient(apiKey);
    const systemInstruction = `
You are an expert AI Text Normalizer and Cleaner for Vietnamese and Multilingual Text-to-Speech (TTS) engines.
Your goal is to prepare text for flawless speech synthesis.
Tasks:
1. Fix improper spacing, duplicate punctuation, and typos.
2. Expand abbreviations into natural spoken form (e.g., "TP.HCM" -> "Thành phố Hồ Chí Minh", "VN" -> "Việt Nam", "TS." -> "Tiến sĩ", "BS." -> "Bác sĩ", "km/h" -> "ki-lô-mét trên giờ").
3. Convert numbers, currencies, dates, and units into standard spoken word text.
4. Keep the original language and tone intact.

Respond STRICTLY in valid JSON matching this schema:
{
  "originalText": "string",
  "cleanedText": "string",
  "modifications": [
    {
      "type": "abbreviation | punctuation | whitespace | date | unit | number",
      "original": "string",
      "replacedWith": "string"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Văn bản cần làm sạch:\n"""\n${text}\n"""`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const result = JSON.parse(responseText);

    res.json({
      originalText: text,
      cleanedText: result.cleanedText || text,
      modifications: result.modifications || [],
      characterDiff: (result.cleanedText || text).length - text.length,
    });
  } catch (error: unknown) {
    console.error("Text cleaning failed:", error);
    const message = error instanceof Error ? error.message : "Lỗi làm sạch văn bản";
    res.status(500).json({
      error: message,
      cleanedText: req.body.text || "",
      modifications: [],
    });
  }
});

// 3. TTS Speech Generation API (/api/tts/generate)
app.post("/api/tts/generate", async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceId = "gemini-Kore",
      speed = 1.0,
      pitch = 0,
      emotion = "neutral",
      styleMode = "normal",
      apiKey,
      provider = "gemini"
    } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Văn bản không được để trống" });
      return;
    }

    const ai = getGenAIClient(apiKey);
    const geminiVoice = mapVoiceNameToGemini(voiceId);

    // Style prompt instruction modifier
    let stylePrompt = "";
    if (styleMode === "news") stylePrompt = "Read clearly in an authoritative news broadcast tone: ";
    else if (styleMode === "storytelling") stylePrompt = "Read expressively with warm storytelling emotion: ";
    else if (styleMode === "teacher") stylePrompt = "Read calmly and clearly like an educational instructor: ";
    else if (styleMode === "mc") stylePrompt = "Read energetically and enthusiastically like an event host: ";
    else if (styleMode === "advertising") stylePrompt = "Read persuasively and lively like a commercial narrator: ";

    if (emotion && emotion !== "neutral") {
      stylePrompt += `(Emotion: ${emotion}) `;
    }

    const fullPrompt = `${stylePrompt}${text}`;

    // Call Gemini 3.1 TTS Model
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: geminiVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("Không nhận được dữ liệu âm thanh từ Gemini TTS API");
    }

    const durationSeconds = Math.max(1, Math.round(text.length / (12 * speed)));

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: "audio/wav",
      sampleRate: 24000,
      durationSeconds,
      voiceUsed: geminiVoice,
      provider
    });
  } catch (error: unknown) {
    console.error("TTS Generation Error:", error);
    const message = error instanceof Error ? error.message : "Lỗi sinh giọng nói";
    res.status(500).json({
      error: message,
      details: "Không thể gọi Gemini TTS. Vui lòng kiểm tra API Key trong Cài đặt."
    });
  }
});

// 4. File Text Extraction Endpoint (/api/tts/extract)
app.post("/api/tts/extract", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Không tìm thấy file" });
      return;
    }

    const buffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Convert raw buffer to utf-8 text
    const textContent = buffer.toString("utf-8");
    
    // Clean non-printable characters
    const sanitizedText = textContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

    res.json({
      success: true,
      fileName,
      text: sanitizedText || "Văn bản rỗng từ file.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi đọc file";
    res.status(500).json({ error: message });
  }
});

// ------------------- VITE SERVER INTEGRATION -------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server AI Text-to-Speech Studio Pro running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
