import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const PORT = process.env['REGISTRY_PORT'] || 4223;
const REGISTRY_PATH = path.resolve(__dirname, '../apps/web/public/r');

if (!fs.existsSync(REGISTRY_PATH)) {
  console.log('⚠️  Registry not found. Building...');
  require('child_process').execSync('npx tsx scripts/build-registry.cts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  let filePath = path.join(REGISTRY_PATH, url.pathname.replace('/r/', ''));

  if (url.pathname === '/r' || url.pathname === '/r/') {
    filePath = path.join(REGISTRY_PATH, 'registry.json');
  }

  if (!filePath.endsWith('.json')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(`❌ 404: ${url.pathname}`);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Component not found', path: url.pathname }));
      return;
    }

    if (filePath.endsWith('registry.json')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(data);
    console.log(`✅ 200: ${url.pathname} (${(data.length / 1024).toFixed(1)} KB)`);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('🚀 ZardUI Local Registry Server');
  console.log('================================');
  console.log(`📡 Registry URL: http://localhost:${PORT}/r`);
  console.log(`📁 Serving from: ${REGISTRY_PATH}`);
  console.log('');
  console.log('Usage with CLI:');
  console.log(`  ZARD_REGISTRY_URL=http://localhost:${PORT}/r npx ngzard add button`);
  console.log('');
  console.log('Or use the dev command:');
  console.log('  npm run dev:cli:test -- add button');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
