/**
 * The shapes a tool answers with.
 *
 * JSON goes back compact: indentation is roughly a third of the tokens of a
 * pretty-printed catalog, and a model reads either equally well.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function text(value: string): CallToolResult {
  return { content: [{ type: 'text', text: value }] };
}

export function json(value: unknown): CallToolResult {
  return text(JSON.stringify(value));
}

/**
 * A failure the model can act on. `isError` matters: without it the client
 * treats the message as a successful answer and the model may quote it as data.
 */
export function fail(message: string): CallToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
