import type { Config } from '@cli/utils/config.js';
import { execa } from 'execa';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_API = 'https://api.github.com/repos/zard-ui/zardui/contents';

function getCliVersion(): string {
  try {
    const packageJsonPath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Failed to read CLI version from package.json, falling back to master branch');
    return 'master';
  }
}

/**
 * Get the GitHub ref (tag or branch) to fetch components from
 * Uses the CLI version tag (e.g., v1.2.3) to ensure component compatibility
 */
function getGithubRef(): string {
  const version = getCliVersion();

  if (version === 'master' || version.includes('dev') || version === '0.0.0') {
    return 'master';
  }

  return `v${version}`;
}

const GITHUB_REF = getGithubRef();
const GITHUB_RAW = `https://raw.githubusercontent.com/zard-ui/zardui/${GITHUB_REF}`;

async function fetchFromGitHubAPI(filePath: string): Promise<string> {
  try {
    const apiUrl = `${GITHUB_API}/${filePath}?ref=${GITHUB_REF}`;
    const { stdout } = await execa('curl', [
      '-s',
      '-H',
      'Accept: application/vnd.github.v3+json',
      '-H',
      'User-Agent: zard-cli',
      apiUrl,
    ]);

    const response = JSON.parse(stdout);

    if (response.message) {
      throw new Error(response.message);
    }

    if (response.content && response.encoding === 'base64') {
      return Buffer.from(response.content, 'base64').toString('utf8');
    }

    throw new Error('Invalid response from GitHub API');
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const rawUrl = `${GITHUB_RAW}/${filePath}`;
    const { stdout } = await execa('curl', ['-s', '-H', 'User-Agent: zard-cli', rawUrl]);

    if (!stdout || stdout.includes('429: Too Many Requests') || stdout.includes('404: Not Found')) {
      throw new Error(`Failed to fetch from both API and raw URL: ${filePath}`);
    }

    return stdout;
  }
}

export async function fetchComponentFromGithub(
  componentName: string,
  fileName: string,
  config: Config,
): Promise<string> {
  try {
    const filePath = `libs/zard/src/lib/components/${componentName}/${fileName}`;

    const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, randomDelay));

    const content = await fetchFromGitHubAPI(filePath);
    return transformContent(content, config);
  } catch (error) {
    throw new Error(`Failed to fetch component ${componentName}/${fileName}: ${error}`);
  }
}

function transformContent(content: string, config: Config): string {
  let transformed = content;

  const utilsImportPath = convertPhysicalPathToImportAlias(config.aliases.utils);
  const componentsImportPath = convertPhysicalPathToImportAlias(config.aliases.components);

  transformed = transformed.replace(
    /from ['"]\.\.\/\.\.\/shared\/utils\/utils['"]/g,
    `from '${utilsImportPath}/merge-classes'`,
  );

  transformed = transformed.replace(
    /from ['"]\.\.\/\.\.\/shared\/utils\/number['"]/g,
    `from '${utilsImportPath}/number'`,
  );

  const componentImportRegex = /from ['"]\.\.\/([\w-/]+)['"]/g;
  transformed = transformed.replace(componentImportRegex, `from '${componentsImportPath}/$1'`);

  transformed = transformed.replace(
    /import \{ ClassValue \} from ['"]class-variance-authority\/dist\/types['"]/g,
    `import { ClassValue } from 'clsx'`,
  );
  transformed = transformed.replace(
    /import \{ ClassValue \} from ['"]class-variance-authority['"]/g,
    `import { ClassValue } from 'clsx'`,
  );

  return transformed;
}

function convertPhysicalPathToImportAlias(physicalPath: string): string {
  const withoutSrc = physicalPath.replace(/^src\/app\//, '@').replace(/^libs\/[^/]+\/src\/lib\//, '@');

  return withoutSrc;
}
