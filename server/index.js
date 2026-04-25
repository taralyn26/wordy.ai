import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/define', async (req, res) => {
  const key = process.env.MERRIAM_WEBSTER_API_KEY;
  const rawWord = String(req.query.word || '').trim();
  const word = rawWord.toLowerCase().replace(/[^a-z'-]/g, '');

  if (!word) {
    return res.status(400).json({ found: false, error: 'missing_word' });
  }
  if (!key) {
    return res.status(503).json({ found: false, error: 'not_configured' });
  }

  try {
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ found: false, error: 'dictionary_upstream_failed' });
    }
    const payload = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      return res.status(404).json({ found: false, word, error: 'not_found' });
    }

    if (typeof payload[0] === 'string') {
      return res.status(404).json({
        found: false,
        word,
        suggestions: payload.slice(0, 5),
        error: 'not_found',
      });
    }

    const entry = payload.find((item) => item && typeof item === 'object' && Array.isArray(item.shortdef));
    if (!entry || !entry.shortdef?.[0]) {
      return res.status(404).json({ found: false, word, error: 'not_found' });
    }

    const firstDef = String(entry.shortdef[0] || '').trim();
    return res.json({
      found: true,
      word: String(entry.hwi?.hw || word).replace(/\*/g, ''),
      partOfSpeech: String(entry.fl || 'word').toLowerCase(),
      definition: firstDef,
    });
  } catch (error) {
    return res.status(500).json({ found: false, error: 'dictionary_lookup_failed' });
  }
});

app.post('/api/tts', async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5';
  const text = String(req.body?.text || '').trim();

  if (!text) {
    return res.status(400).json({ error: 'missing_text' });
  }
  if (!apiKey) {
    return res.status(503).json({ error: 'not_configured' });
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'tts_upstream_failed', details: errorText });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(audioBuffer);
  } catch (error) {
    return res.status(500).json({ error: 'tts_failed' });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
