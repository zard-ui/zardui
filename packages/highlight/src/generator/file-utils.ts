import fs from 'fs-extra';

const normalize = (s: string): string => s.replace(/\r\n/g, '\n');

export function writeIfChanged(filePath: string, content: string): boolean {
  if (fs.existsSync(filePath)) {
    const existing = normalize(fs.readFileSync(filePath, 'utf-8'));
    if (existing === normalize(content)) return false;
  }
  fs.writeFileSync(filePath, content);
  return true;
}
