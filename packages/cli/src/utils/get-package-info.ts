import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function getPackageInfo(): Promise<PackageJson> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packageJsonPath = path.resolve(__dirname, '../../../package.json');

  return await fs.readJson(packageJsonPath);
}
