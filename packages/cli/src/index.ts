import { add } from '@cli/commands/add/index.js';
import { init } from '@cli/commands/init/index.js';
import { APP_VERSION } from '@cli/constants/app.constants.js';
import { CliError } from '@cli/utils/errors.js';
import { enableDebug, isDebugEnabled, logger } from '@cli/utils/logger.js';
import { Command } from 'commander';

async function main() {
  const program = new Command()
    .name('ngzard')
    .description('add beautiful Angular components to your apps')
    .version(APP_VERSION, '-v, --version', 'display the version number')
    .option('--debug', 'enable debug logging')
    .hook('preAction', (_thisCommand, actionCommand) => {
      const opts = actionCommand.optsWithGlobals?.() ?? actionCommand.opts?.();
      if (opts?.debug || process.env['NGZARD_DEBUG']) {
        enableDebug();
      }
    });

  program.addCommand(init).addCommand(add);

  program.parse();
}

main().catch(error => {
  if (error instanceof CliError) {
    logger.error(error.message);
    if (isDebugEnabled()) {
      console.error(error.stack);
    }
  } else {
    logger.error('An unexpected error occurred.');
    logger.error(error instanceof Error ? error.message : String(error));
    if (isDebugEnabled()) {
      console.error(error);
    }
  }
  process.exit(1);
});
