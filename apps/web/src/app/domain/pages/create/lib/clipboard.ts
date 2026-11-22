/** Copies text, falling back to a hidden textarea where the async clipboard API is unavailable or refused. */
export async function copyText(document: Document, text: string): Promise<boolean> {
  try {
    await document.defaultView?.navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }
}
