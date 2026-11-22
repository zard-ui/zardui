const ACRONYMS = new Set(['rtl', 'ltr', 'api', 'url', 'ui', 'cli', 'otp', 'css', 'html', 'id']);

/** The title of a demo from its registry name: `with-icon` -> `With Icon`, `rtl` -> `RTL`. */
export function exampleTitle(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(word => (ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}
