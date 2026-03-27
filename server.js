// Simple static file server — run with: node server.js
// Then open http://localhost:3000 in your browser
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.mp3':  'audio/mpeg',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Space Shooter running at http://localhost:${PORT}`);
});
