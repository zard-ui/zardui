import { add } from '@cli/commands/add/index.js';
import { init } from '@cli/commands/init/index.js';
import { APP_VERSION } from '@cli/constants/app.constants.js';
import { CliError } from '@cli/utils/errors.js';
import { enableDebug, isDebugEnabled, logger } from '@cli/utils/logger.js';
import chalk from 'chalk';
import { Command } from 'commander';

function checkDeprecatedPackageName(): void {
  const execPath = process.argv[1] ?? '';
  if (execPath.includes('@ngzard/ui') || execPath.includes('@ngzard%2fui')) {
    logger.warn(chalk.bold('⚠ @ngzard/ui has been renamed to zard-cli.'));
    logger.warn('  Please use: npx zard-cli@latest <command>');
    logger.break();
  }
}

async function main() {
  checkDeprecatedPackageName();

  const program = new Command()
    .name('zard-cli')
    .description('add beautiful Angular components to your apps')
    .version(APP_VERSION, '-v, --version', 'display the version number')
    .option('--debug', 'enable debug logging')
    .hook('preAction', (_thisCommand, actionCommand) => {
      const opts = actionCommand.optsWithGlobals?.() ?? actionCommand.opts?.();
      if (opts?.debug || process.env['ZARD_DEBUG']) {
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
