import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const ALLOWED_CHAT_MODELS = new Set([
  'gemini-4-hydrogen',
  'gemini-3.1-flash-lite',
  'gemini-4-carbon',
  'gemini-4-neon',
]);

const ALLOWED_IMAGE_SIZES = new Set(['1K', '2K', '4K']);
const ALLOWED_ASPECT_RATIOS = new Set(['1:1', '3:4', '4:3', '16:9']);

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(err: unknown): { status: number; message: string; code: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const lower = rawMessage.toLowerCase();

  if (lower.includes('permission_denied') || lower.includes('403') || lower.includes('api_key_invalid') || lower.includes('api key not valid')) {
    return {
      status: 403,
      code: 'API_KEY_OR_BILLING_REQUIRED',
      message: 'Gemini API rejected this request (403 / invalid or restricted key). Please verify your GEMINI_API_KEY or select a billing-enabled key in Settings > Secrets.',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    return {
      status: 429,
      code: 'QUOTA_OR_PAID_TIER_REQUIRED',
      message: 'Quota exceeded or paid tier required for this model (429). Try switching to gemini-4-hydrogen / gemini-3.1-flash-lite, or select a billing-enabled key in Settings > Secrets.',
    };
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return {
      status: 404,
      code: 'MODEL_NOT_FOUND',
      message: `Requested Gemini model was not found or is currently unavailable: ${rawMessage}`,
    };
  }

  return {
    status: 500,
    code: 'GEMINI_UPSTREAM_ERROR',
    message: rawMessage || 'Unexpected error communicating with Gemini API.',
  };
}

interface ChatTurnInput {
  role: 'user' | 'model';
  text: string;
}

interface StudentContextInput {
  aggregate?: number;
  currentCollege?: string;
  quotaCategory?: string;
  preferredColleges?: string[];
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/export', (req, res) => {
    const textFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'index.html',
      'metadata.json',
      '.env.example',
      'server.ts',
      'src/main.tsx',
      'src/index.css',
      'src/App.tsx',
      'src/types/uhs.ts',
      'src/data/uhsColleges.ts',
      'src/components/CollegeDrawer.tsx',
      'src/components/EditorialImage.tsx',
      'src/components/ErrorBoundary.tsx',
      'src/components/UpgradationTrackerView.tsx',
    ];

    const binaryAssets = [
      'src/assets/images/uhs_campus_banner_1795506259312.jpg',
      'src/assets/images/white_coat_milestone_1795506260703.jpg',
      'src/assets/images/kemc_courtyard_1795506260122.jpg',
    ];

    const chunks: string[] = [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '# UHS MeritPulse - Complete Single-File Project Bundle',
      '# Usage: bash uhs-meritpulse-bundle.sh && npm install && npm run dev',
      '',
      'mkdir -p src/lib src/types src/data src/components src/assets/images',
      '',
    ];

    for (const relPath of textFiles) {
      const fullPath = path.resolve(__dirname, relPath);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      chunks.push(`# === FILE: ${relPath} ===`);
      chunks.push(`cat <<'__UHS_MERITPULSE_EOF__' > "${relPath}"`);
      chunks.push(content.endsWith('\n') ? content.slice(0, -1) : content);
      chunks.push('__UHS_MERITPULSE_EOF__');
      chunks.push('');
    }

    for (const relPath of binaryAssets) {
      const fullPath = path.resolve(__dirname, relPath);
      if (!fs.existsSync(fullPath)) continue;
      const b64 = fs.readFileSync(fullPath).toString('base64');
      chunks.push(`# === ASSET: ${relPath} ===`);
      chunks.push(`base64 -d <<'__UHS_MERITPULSE_B64__' > "${relPath}"`);
      chunks.push(b64);
      chunks.push('__UHS_MERITPULSE_B64__');
      chunks.push('');
    }

    chunks.push('echo "All UHS MeritPulse files extracted. Run: npm install && npm run dev"');

    if (req.query.download === '1') {
      res.setHeader('Content-Disposition', 'attachment; filename="uhs-meritpulse-bundle.sh"');
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(chunks.join('\n'));
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          code: 'MISSING_API_KEY',
          message: 'GEMINI_API_KEY is not configured in the server environment. Please add it in Settings > Secrets.',
        });
      }

      const body = req.body as {
        messages?: ChatTurnInput[];
        model?: string;
        studentContext?: StudentContextInput | null;
      };

      const messages = Array.isArray(body.messages) ? body.messages : [];
      if (messages.length === 0) {
        return res.status(400).json({
          code: 'EMPTY_MESSAGES',
          message: 'Please enter a message before sending.',
        });
      }

      const selectedModel = typeof body.model === 'string' && ALLOWED_CHAT_MODELS.has(body.model)
        ? body.model
        : 'gemini-4-hydrogen';

      const latest = messages[messages.length - 1];
      if (!latest || latest.role !== 'user' || typeof latest.text !== 'string' || !latest.text.trim()) {
        return res.status(400).json({
          code: 'INVALID_LAST_TURN',
          message: 'The latest message must be a non-empty user prompt.',
        });
      }

      const history = messages.slice(0, -1)
        .filter((m) => (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim().length > 0)
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text.trim() }],
        }));

      let contextBlock = '';
      if (body.studentContext) {
        const parts: string[] = [];
        if (typeof body.studentContext.aggregate === 'number' && !Number.isNaN(body.studentContext.aggregate)) {
          parts.push(`Student UHS Aggregate: ${body.studentContext.aggregate.toFixed(4)}%`);
        }
        if (body.studentContext.currentCollege) {
          parts.push(`Current Allotted / Baseline College: ${body.studentContext.currentCollege}`);
        }
        if (body.studentContext.quotaCategory) {
          parts.push(`Quota Category: ${body.studentContext.quotaCategory}`);
        }
        if (Array.isArray(body.studentContext.preferredColleges) && body.studentContext.preferredColleges.length > 0) {
          parts.push(`Target Preference Order: ${body.studentContext.preferredColleges.join(' -> ')}`);
        }
        if (parts.length > 0) {
          contextBlock = `\n\nActive Student Context:\n${parts.join('\n')}`;
        }
      }

      const systemInstruction =
        'You are the UHS MeritPulse Admissions Advisor, a specialist in University of Health Sciences (UHS) Lahore Punjab Public Sector MBBS admissions, selection lists, and upgradation mechanics.\n' +
        'Key facts you ground answers in:\n' +
        '- UHS Open Merit Aggregate Formula: 50% MDCAT (180 marks current PMDC scale, or 200 marks legacy) + 40% FSc (HSSC Pre-Medical) + 10% Matric (SSC).\n' +
        '- 17 Punjab Public Sector MBBS colleges under UHS (2025–2026 final / active cycle benchmarks): KEMU Lahore (~94.87%–94.96%), AIMC Lahore (~94.45%–94.54%), SIMS Lahore (~94.22%–94.32%), Nishtar Multan (~94.09%–94.19%), RMU Rawalpindi (~93.92%–94.02%), FJMU Lahore (~93.85%–93.95%, female-only), AMC Lahore (~93.83%–93.92%), PMC/FMU Faisalabad (~93.75%–93.84%), QAMC Bahawalpur (~93.70%–93.79%), down through GMC Gujranwala, SMC Sargodha, NSMC Gujrat, SZMC Rahim Yar Khan, SLMC Sahiwal, KMSMC Sialkot, DGKMC D.G. Khan (~93.53%), and Narowal Medical College (~93.51%–93.57%).\n' +
        '- Upgradation rules: Students must deposit the fee challan and submit joining at their provisionally allotted college within the round deadline to remain eligible for automatic upgradation to higher-ranked preferences in subsequent lists unless they sign a Stay/Freeze undertaking.\n' +
        'Be concise, structured, empathetic, and transparent about uncertainty—never fabricate official UHS notifications that have not been released.' +
        contextBlock;

      const chat = ai.chats.create({
        model: selectedModel,
        config: {
          systemInstruction,
        },
        history,
      });

      const response = await chat.sendMessage({
        message: latest.text.trim(),
      });

      const replyText = response.text?.trim() || 'No response text was returned by the model.';
      return res.json({
        reply: replyText,
        model: selectedModel,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json(formatted);
    }
  });

  app.post('/api/generate-image', async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          code: 'MISSING_API_KEY',
          message: 'GEMINI_API_KEY is not configured in the server environment. Please add it in Settings > Secrets.',
        });
      }

      const body = req.body as {
        prompt?: string;
        collegeName?: string;
        milestoneScene?: string;
        imageSize?: string;
        aspectRatio?: string;
      };

      const rawPrompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
      if (!rawPrompt) {
        return res.status(400).json({
          code: 'EMPTY_PROMPT',
          message: 'Please provide a scene description to generate an image.',
        });
      }

      const imageSize = typeof body.imageSize === 'string' && ALLOWED_IMAGE_SIZES.has(body.imageSize)
        ? body.imageSize
        : '1K';
      const aspectRatio = typeof body.aspectRatio === 'string' && ALLOWED_ASPECT_RATIOS.has(body.aspectRatio)
        ? body.aspectRatio
        : '4:3';

      const collegeContext = body.collegeName ? `Set at ${body.collegeName}, Punjab, Pakistan. ` : '';
      const sceneContext = body.milestoneScene ? `Milestone theme: ${body.milestoneScene}. ` : '';
      const fullPrompt = `${collegeContext}${sceneContext}${rawPrompt}. Editorial documentary photography, authentic South Asian medical university architecture, natural daylight, refined realistic textures.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize,
          },
        },
      });

      let imageDataUrl: string | null = null;
      let caption = '';

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          imageDataUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption += part.text;
        }
      }

      if (!imageDataUrl) {
        return res.status(502).json({
          code: 'NO_IMAGE_RETURNED',
          message: 'The image model completed without returning an image payload. Try refining your prompt.',
        });
      }

      return res.json({
        imageDataUrl,
        caption: caption.trim(),
        model: 'gemini-3-pro-image-preview',
        imageSize,
        aspectRatio,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json(formatted);
    }
  });

  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UHS MeritPulse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
