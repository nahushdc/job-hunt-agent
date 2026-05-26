import 'dotenv/config';
import express from 'express';
import { Readable } from 'stream';

const app = express();
app.use(express.json({ limit: '50kb' }));

const MODELS = {
  quick:    { id: 'claude-haiku-4-5-20251001',   maxTokens: 1000 },
  detailed: { id: 'claude-sonnet-4-20250514',    maxTokens: 2000 },
};

const WEB_SEARCH_TOOL = { type: 'web_search_20250305', name: 'web_search' };

app.post('/api/stream', async (req, res) => {
  const { prompt, mode = 'detailed', useWebSearch = true } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in server .env' });
  }

  const { id: model, maxTokens } = MODELS[mode] ?? MODELS.detailed;
  const tools = useWebSearch ? [WEB_SEARCH_TOOL] : [];

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        stream: true,
        ...(tools.length > 0 && { tools }),
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach Anthropic API', detail: err.message });
  }

  if (!upstream.ok) {
    const body = await upstream.text();
    return res.status(upstream.status).send(body);
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  Readable.fromWeb(upstream.body).pipe(res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server →  http://localhost:${PORT}`);
  console.log(`API key   ${process.env.ANTHROPIC_API_KEY ? '✓ loaded' : '✗ missing — set ANTHROPIC_API_KEY in .env'}`);
});
