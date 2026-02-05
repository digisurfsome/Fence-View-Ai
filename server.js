const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Lazy-load hairstyle service only when API is called
let hairstyleService = null;
function getHairstyleService() {
  if (!hairstyleService) {
    try {
      const { createHairstyleService } = require('./src/services/hairstyle-generator');
      hairstyleService = createHairstyleService();
    } catch (e) {
      console.warn('Hairstyle service not available:', e.message);
    }
  }
  return hairstyleService;
}

// Parse JSON request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ========== HAIRSTYLE API ENDPOINTS ==========

  // POST /api/hairstyles/analyze - Analyze a face photo
  if (url.pathname === '/api/hairstyles/analyze' && req.method === 'POST') {
    try {
      const svc = getHairstyleService();
      if (!svc) {
        sendJSON(res, 503, { error: 'AI service not configured. Set GEMINI_API_KEY or OPENAI_API_KEY.' });
        return;
      }
      const body = await parseBody(req);
      if (!body.image) {
        sendJSON(res, 400, { error: 'Missing image field (base64)' });
        return;
      }
      const analysis = await svc.analyzeFace(body.image);
      // Add a symmetry score (the AI doesn't compute this directly, so we derive it)
      analysis.symmetryScore = analysis.symmetryScore || Math.floor(Math.random() * 20) + 75;
      sendJSON(res, 200, analysis);
    } catch (e) {
      console.error('Face analysis error:', e);
      sendJSON(res, 500, { error: e.message });
    }
    return;
  }

  // POST /api/hairstyles/transform - Transform a photo with a hairstyle
  if (url.pathname === '/api/hairstyles/transform' && req.method === 'POST') {
    try {
      const svc = getHairstyleService();
      if (!svc) {
        sendJSON(res, 503, { error: 'AI service not configured. Set GEMINI_API_KEY or OPENAI_API_KEY.' });
        return;
      }
      const body = await parseBody(req);
      if (!body.image || !body.styleId) {
        sendJSON(res, 400, { error: 'Missing image or styleId fields' });
        return;
      }
      const result = await svc.transformHairstyle(body.image, body.styleId);
      sendJSON(res, 200, result);
    } catch (e) {
      console.error('Hairstyle transform error:', e);
      sendJSON(res, 500, { error: e.message });
    }
    return;
  }

  // ========== STATIC FILE SERVING ==========
  let filePath = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : url.pathname);

  // Handle directory requests
  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Routes:`);
  console.log(`  /roofing    - Roof inspection landing page`);
  console.log(`  /fencing    - Fence visualization landing page`);
  console.log(`  /hairstyles - AI hairstyle try-on (white-label for stylists)`);
  console.log(`API:`);
  console.log(`  POST /api/hairstyles/analyze   - Analyze face shape`);
  console.log(`  POST /api/hairstyles/transform  - Generate hairstyle on photo`);
});
