import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { registry } from './commands/registry.js';
import { validate } from './commands/validate.js';
import { optimize } from './commands/optimize.js';
import { APP_VERSION } from './constants/app.constants.js';

async function main() {
  const program = new Command().name('ngzard').description('add beautiful Angular components to your apps').version(APP_VERSION, '-v, --version', 'display the version number');

  program.addCommand(init).addCommand(add).addCommand(registry).addCommand(validate).addCommand(optimize);

  program.parse();
}

main();
