import * as fs from 'fs-extra';
import * as path from 'path';

let watching = false;
const componentsPath = path.resolve(__dirname, '../libs/zard/src/lib/components');

console.log('Watching files change...');
fs.watch(
  componentsPath,
  {
    persistent: true,
    recursive: true,
  },
  (eventType: any, fileName: string) => {
    if (eventType != 'change') return;

    const skips = ['demo', 'doc'];
    if (!skips.some(x => fileName?.includes(x))) return;

    if (watching) return;
    watching = true;

    console.log('\n📝  ' + fileName + ' was changed.');
    console.log('🧱  Generating files...');

    generateFiles();

    setTimeout(() => {
      watching = false;
    }, 3000);
  },
);

function generateFiles() {
  const componentsDir = fs.readdirSync(componentsPath);
  componentsDir.forEach((componentName: string) => {
    const componentDirPath = path.join(componentsPath, componentName);

    const skips = ['styles', 'core'];
    if (skips.indexOf(componentName) !== -1) return;

    if (fs.statSync(componentDirPath).isDirectory()) {
      copyFolder(componentDirPath, componentName, 'demo');
      copyFolder(componentDirPath, componentName, 'doc');
    }
  });

  console.log('✅  Files generated with success!');
}

function copyFolder(componentDirPath: string, componentName: string, folderName: string) {
  const frontendResourcePath = path.resolve(__dirname, '../apps/web/public');

  const demoDirPath = path.join(componentDirPath, folderName);
  if (!fs.existsSync(demoDirPath)) return;

  const demoAssetsDirPath = path.join(frontendResourcePath, `components/${componentName}/${folderName}`);
  fs.copySync(demoDirPath, demoAssetsDirPath, { overwrite: true });
}
