const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const libNames = ['zard'];

for (const libName of libNames) {
  const versionFile = path.join(__dirname, `../libs/${libName}/src/index.ts`);
  const libVersionTs = fs.readFileSync(versionFile, 'utf8');

  const newIndexContent = libVersionTs.replace(
    /^export const VERSION = new Version\('[^']*'\);$/gm,
    `export const VERSION = new Version('${packageJson.version}');`,
  );

  fs.writeFileSync(versionFile, newIndexContent);

  console.log(`Generated ${libName} version.ts with VERSION = "${packageJson.version}"`);
}
