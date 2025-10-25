import { Command } from 'commander';
import { init } from '@cli/commands/init/index.js';
import { add } from '@cli/commands/add/index.js';
import { APP_VERSION } from '@cli/constants/app.constants.js';

async function main() {
  const program = new Command().name('ngzard').description('add beautiful Angular components to your apps').version(APP_VERSION, '-v, --version', 'display the version number');

  program.addCommand(init).addCommand(add);

  program.parse();
}

main();
