import { version } from '@zard-package';

/**
 * The published `@zard/ui` version, read straight from `libs/zard/package.json` at
 * build time. Single source of truth so the changelog announcement (and anything
 * else that names the version) cannot drift from what actually ships.
 */
export const ZARD_VERSION = version;
