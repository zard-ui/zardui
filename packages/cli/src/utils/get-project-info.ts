import path from 'path';
import fs from 'fs-extra';
import { z } from 'zod';

const packageJsonSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
});

type ProjectInfo = {
  framework: 'angular' | 'unknown';
  hasTypeScript: boolean;
  hasTailwind: boolean;
  hasNx: boolean;
  angularVersion: string | null;
};

export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    throw new Error('No package.json found. Please run this command in your project root.');
  }

  const packageJson = packageJsonSchema.parse(await fs.readJson(packageJsonPath));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const hasAngular = !!deps['@angular/core'];
  const hasTypeScript = !!deps['typescript'];
  const hasTailwind = !!deps['tailwindcss'];
  const hasNx = !!deps['nx'] || !!deps['@nx/workspace'];

  const angularVersion = deps['@angular/core']?.replace(/[^0-9.]/g, '') || null;

  return {
    framework: hasAngular ? 'angular' : 'unknown',
    hasTypeScript,
    hasTailwind,
    hasNx,
    angularVersion,
  };
}
