import { add } from '@cli/commands/add/index.js';
import { apply } from '@cli/commands/apply/index.js';
import { create } from '@cli/commands/create/index.js';
import { init } from '@cli/commands/init/index.js';
import { APP_VERSION } from '@cli/constants/app.constants.js';
import { style } from '@cli/ui/style.js';
import { CliError } from '@cli/utils/errors.js';
import { INTERRUPTED_EXIT_CODE, InterruptedError, onInterrupt } from '@cli/utils/interrupt.js';
import { enableDebug, isDebugEnabled, logger } from '@cli/utils/logger.js';
import { Command } from 'commander';

function checkDeprecatedPackageName(): void {
  const execPath = process.argv[1] ?? '';
  if (execPath.includes('@ngzard/ui') || execPath.includes('@ngzard%2fui')) {
    logger.warn(style.bold('@ngzard/ui has been renamed to zard-cli.'));
    logger.warn('  Please use: npx zard-cli@latest <command>');
    logger.break();
  }
}

async function main() {
  checkDeprecatedPackageName();

  // Every command: Ctrl+C (or a closing terminal) stops the processes the CLI started and leaves with 130.
  // Commands that own something to undo (create) add their own cleanup on top.
  onInterrupt(() => undefined);

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

  program.addCommand(init).addCommand(add).addCommand(apply).addCommand(create);

  // parseAsync, not parse: the actions are async, and only this way does a
  // failure inside them reach the handler below instead of becoming an
  // unhandled rejection.
  await program.parseAsync();
}

main().catch(error => {
  if (error instanceof InterruptedError) {
    // The interrupted run already undid its work; this only says so and sets the code.
    error.announce();
    process.exitCode = INTERRUPTED_EXIT_CODE;
    return;
  }

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
  // Not `process.exit`: leaving while stdin or the network still have handles closing aborts Node on
  // Windows (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`, exit 127). Setting the code and
  // letting the loop drain exits with it. The timer is the way out for a handle that never closes; it is
  // unref'd, so it does not keep a process that is already finished alive.
  process.exitCode = 1;
  setTimeout(() => process.exit(1), 2000).unref();
});
