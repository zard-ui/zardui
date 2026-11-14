/**
 * Turns the backtick spans of a plain-text docs string into `<code>` elements, escaping everything else, so the
 * result is safe for `[innerHTML]`. Doc data (API descriptions, accessibility notes) writes code as `` `zValue` ``.
 */
export function inlineCode(text: string): string {
  return text
    .split(/(`[^`]+`)/g)
    .map(segment => {
      const isCode = segment.length > 1 && segment.startsWith('`') && segment.endsWith('`');
      const content = escapeHtml(isCode ? segment.slice(1, -1) : segment);
      return isCode ? `<code>${content}</code>` : content;
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
