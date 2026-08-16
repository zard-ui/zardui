/**
 * Component and block names as they arrive from whoever calls the tools.
 *
 * They get interpolated into URLs and passed to a process, so validation lives
 * here, next to whatever builds the URL, rather than in each tool: a new tool
 * can forget to validate, a service cannot.
 *
 * Without this, a component name of `../../admin/secret` escapes the registry
 * directory — `https://zardui.com/r/button.json` becomes
 * `https://zardui.com/admin/secret.json`, and the body comes back to the model
 * that asked. Against the public registry that is minor; against a private
 * registryUrl it is the server fetching addresses on the company network on
 * behalf of whoever wrote the prompt.
 *
 * The identifier also cannot carry `?` or `#`, which would change the query of
 * the request, nor the separators that would give the name a path meaning.
 */

/** The shape the registry uses: a letter or digit, then letters, digits and dashes. */
const REGISTRY_ID = /^[a-z0-9][a-z0-9-]*$/i;

const MAX_LENGTH = 64;

export type IdentifierKind = 'component' | 'block';

export class InvalidIdentifierError extends Error {
  constructor(kind: IdentifierKind, value: string) {
    super(
      `Invalid ${kind} name "${value}". Names may only contain letters, digits and dashes, ` +
        `and must start with a letter or digit.`,
    );
    this.name = 'InvalidIdentifierError';
  }
}

/** Returns the identifier when it is acceptable; throws when it is not. */
export function assertRegistryId(value: string, kind: IdentifierKind): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_LENGTH || !REGISTRY_ID.test(value)) {
    throw new InvalidIdentifierError(kind, value);
  }

  return value;
}
