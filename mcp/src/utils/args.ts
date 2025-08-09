/**
 * Command-line argument parser for ZardUI MCP Server
 */

export interface ParsedArgs {
  help?: boolean;
  version?: boolean;
  logLevel?: string;
  projectPath?: string;
}

export async function parseArgs(): Promise<ParsedArgs> {
  const args = process.argv.slice(2);
  const parsed: ParsedArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        parsed.help = true;
        break;

      case '--version':
      case '-v':
        parsed.version = true;
        break;

      case '--log-level':
        if (i + 1 < args.length) {
          parsed.logLevel = args[i + 1];
          i++; // Skip next argument
        }
        break;

      case '--project-path':
        if (i + 1 < args.length) {
          parsed.projectPath = args[i + 1];
          i++; // Skip next argument
        }
        break;

      default:
        if (arg.startsWith('--log-level=')) {
          parsed.logLevel = arg.split('=')[1];
        } else if (arg.startsWith('--project-path=')) {
          parsed.projectPath = arg.split('=')[1];
        }
        break;
    }
  }

  return parsed;
}
