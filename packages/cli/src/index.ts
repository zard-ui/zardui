import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { getPackageInfo } from './utils/get-package-info.js';

async function main() {
  const packageInfo = await getPackageInfo();

  const program = new Command()
    .name('zard')
    .description('add components to your Angular apps')
    .version(packageInfo.version || '0.0.1', '-v, --version', 'display the version number');

  program.addCommand(init).addCommand(add);

  program.parse();
}

main();
