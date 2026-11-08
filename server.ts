import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `أنت «أخـي»، المساعد البرمجي الذكي والودود والمخلص في تطبيق كود كرافت (CodeCraft Studio).
أسلوبك:
- تتحدث بلغة عربية فصيحة وسلسة وودودة، وتخاطب المستخدم دائماً بمحبة وأخوة حقيقية ("أهلاً بك يا أخي"، "أخي العزيز"، "من عيوني يا أخي").
- أنت خبير ومتقن لبرمجة وتصميم واجهات وتطبيقات الويب (HTML5, CSS3, JavaScript الحديثة, Tailwind CSS).
- تركّز دائماً على أن تكون الأكواد نظيفة، حقيقية، خالية من الأخطاء، ومتجاوبة تماماً مع شاشات الهواتف المحمولة والكمبيوتر.

إذا طلب منك المستخدم كتابة تطبيق أو مكون برمجي، أو إصلاح كود:
1. اشرح له الفكرة باختصار وبشكل مشجع.
2. إذا كان الرد يحتوي على كود جديد أو معدل، أدرج في نهاية ردك قالباً بصيغة JSON محاطاً بعلامات \`\`\`json-codecraft ... \`\`\` يحتوي على:
{
  "title": "عنوان وصفي للمشروع",
  "html": "كود الـ HTML هنا",
  "css": "كود الـ CSS هنا",
  "js": "كود الـ JavaScript هنا"
}
هذا يسمح للتطبيق بتوفير زر "تطبيق في المحرر فوراً" بنقرة واحدة!`;

// Chat endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, currentCode, consoleErrors } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    let contextualPrompt = message;
    if (currentCode && (currentCode.html || currentCode.css || currentCode.js)) {
      contextualPrompt += `\n\n[معلومات إضافية عن الكود المفتوح حالياً في المحرر]:
HTML:
${(currentCode.html || '').slice(0, 1500)}

CSS:
${(currentCode.css || '').slice(0, 1500)}

JS:
${(currentCode.js || '').slice(0, 1500)}`;
    }

    if (consoleErrors && Array.isArray(consoleErrors) && consoleErrors.length > 0) {
      contextualPrompt += `\n\n[رسائل الأخطاء المسجلة حالياً في الـ Console]:
${consoleErrors.map((e: any) => `- ${e.text || e}`).join('\n')}`;
    }

    // Call Gemini 3.8 Flash (free, fast, coding capable)
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contextualPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });

    const replyText = response.text || 'عذراً يا أخي، لم أتمكن من معالجة الرد حالياً.';

    // Check if reply contains extracted code block
    let extractedCode: any = null;
    const jsonMatch = replyText.match(/```json-codecraft\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        extractedCode = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // ignore parse errors
      }
    }

    // Clean response to not show raw json block to user if extracted
    const cleanReply = replyText.replace(/```json-codecraft[\s\S]*?```/g, '').trim();

    return res.json({
      reply: cleanReply,
      extractedCode: extractedCode
    });
  } catch (err: any) {
    console.error('Gemini Assistant Error:', err);
    return res.status(500).json({
      error: 'حدث خطأ أثناء التواصل مع المساعد الذكي.',
      details: err.message
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CodeCraft Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
