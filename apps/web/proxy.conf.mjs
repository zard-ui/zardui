import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  '/llms.txt': {
    target: 'http://localhost:4222',
    secure: false,
    logLevel: 'info',
    bypass: function (req, res) {
      const filePath = join(__dirname, 'public', 'llms.txt');

      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(content);
        return true;
      }
      return false;
    },
  },
};
