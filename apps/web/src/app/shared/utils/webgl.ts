let webgl2: boolean | undefined;

/**
 * Whether this browser can create a WebGL2 context. MapLibre 6 needs it: without it a map cannot start.
 *
 * Browser-only (it answers `true` on the server, where no map is created) and cached, since probing creates a
 * context. The probe context is released right away so it does not count against the browser's limit.
 */
export function supportsWebGL2(): boolean {
  if (typeof document === 'undefined') {
    return true;
  }

  if (webgl2 === undefined) {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      webgl2 = !!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      webgl2 = false;
    }
  }

  return webgl2;
}
