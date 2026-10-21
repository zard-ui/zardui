/** Routes that render their content alone, with no header and no footer: a document embedded in an iframe. */
export const PREVIEW_URL_PREFIXES = ['/blocks/preview/', '/typeset/preview', '/create/preview/'];

/** Whether a path is one of those bare documents. They are part of a page that already ran the site-level services. */
export const isPreviewUrl = (url: string): boolean => PREVIEW_URL_PREFIXES.some(prefix => url.startsWith(prefix));
