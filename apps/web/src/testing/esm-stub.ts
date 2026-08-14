/**
 * Stub for the ESM-only markdown toolchain (unified / remark / rehype / shiki).
 *
 * Jest cannot parse those packages without transforming the whole dependency
 * tree, and no test in this project exercises markdown rendering — the pages
 * under test only need the services to be constructible. Anything imported from
 * them resolves to a no-op through this module's Proxy.
 */
const noop = () => undefined;

const chainable: unknown = new Proxy(noop, {
  get: () => chainable,
  apply: () => chainable,
});

export default chainable;
export const unified = () => chainable;
export const visit = noop;
