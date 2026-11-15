/**
 * Toast is deprecated in favour of Sonner, as in shadcn/ui: its page only says so and links to the `sonner` page.
 * `zard-cli add toast` installs `sonner` (see `packages/cli/src/commands/add/install-aliases.ts`).
 */
export const TOAST = {
  componentName: 'toast',
  description: 'A succinct message that is displayed temporarily.',
  deprecatedFor: 'sonner',
  examples: [],
};
