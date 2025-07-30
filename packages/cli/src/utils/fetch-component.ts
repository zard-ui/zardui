import { execa } from 'execa';

import type { Config } from './config.js';

const GITHUB_API = 'https://api.github.com/repos/zard-ui/zardui/contents';
const GITHUB_RAW = 'https://raw.githubusercontent.com/zard-ui/zardui/master';

async function fetchFromGitHubAPI(filePath: string): Promise<string> {
  try {
    const apiUrl = `${GITHUB_API}/${filePath}`;
    const { stdout } = await execa('curl', ['-s', '-H', 'Accept: application/vnd.github.v3+json', '-H', 'User-Agent: zard-cli', apiUrl]);

    const response = JSON.parse(stdout);

    if (response.message) {
      throw new Error(response.message);
    }

    if (response.content && response.encoding === 'base64') {
      return Buffer.from(response.content, 'base64').toString('utf8');
    }

    throw new Error('Invalid response from GitHub API');
  } catch (error) {
    // Fallback to raw URL with longer delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const rawUrl = `${GITHUB_RAW}/${filePath}`;
    const { stdout } = await execa('curl', ['-s', '-H', 'User-Agent: zard-cli', rawUrl]);

    if (!stdout || stdout.includes('429: Too Many Requests') || stdout.includes('404: Not Found')) {
      throw new Error(`Failed to fetch from both API and raw URL: ${filePath}`);
    }

    return stdout;
  }
}

export async function fetchComponentFromGithub(componentName: string, fileName: string, config: Config): Promise<string> {
  try {
    const filePath = `libs/zard/src/lib/components/${componentName}/${fileName}`;

    // Add staggered delay based on component order to avoid hitting rate limits
    const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, randomDelay));

    const content = await fetchFromGitHubAPI(filePath);
    return transformContent(content, config);
  } catch (error) {
    throw new Error(`Failed to fetch component ${componentName}/${fileName}: ${error}`);
  }
}

function transformContent(content: string, config: Config): string {
  // Minimal transformations - just fix the essential imports
  let transformed = content;

  // Transform the shared utils import
  transformed = transformed.replace(/from ['"]\.\.\/\.\.\/shared\/utils\/utils['"]/g, `from '@shared/utils/merge-classes'`);

  // Transform relative component imports
  const componentImportRegex = /from ['"]\.\.\/([\w-]+)['"]/g;
  transformed = transformed.replace(componentImportRegex, `from '@shared/components/$1'`);

  // Fix ClassValue import - it should come from clsx, not class-variance-authority
  transformed = transformed.replace(/import \{ ClassValue \} from ['"]class-variance-authority\/dist\/types['"]/g, `import { ClassValue } from 'clsx'`);
  transformed = transformed.replace(/import \{ ClassValue \} from ['"]class-variance-authority['"]/g, `import { ClassValue } from 'clsx'`);

  return transformed;
}
